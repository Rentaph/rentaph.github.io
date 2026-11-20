// Sends a phone alert when someone gets a new request, message or status change.
const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const { setGlobalOptions } = require('firebase-functions/v2');
const admin = require('firebase-admin');

admin.initializeApp();
setGlobalOptions({ region: process.env.RENTA_REGION || 'asia-southeast1', maxInstances: 5 });

const INBOX = 'https://rentaph.github.io/app.html#requests';
const ICON = 'https://rentaph.github.io/icon-192.png';
const STALE = ['messaging/registration-token-not-registered', 'messaging/invalid-registration-token', 'messaging/invalid-argument'];

exports.notifyOnInquiry = onDocumentWritten('inquiries/{id}', async (event) => {
  const before = event.data.before.exists ? event.data.before.data() : null;
  const after = event.data.after.exists ? event.data.after.data() : null;
  if (!after) return;

  let to, title, body;
  if (!before) {
    to = after.ownerId;
    title = 'New request';
    body = `${after.fromName || 'A customer'} · ${after.itemTitle || 'your listing'}`;
  } else if ((after.lastAt || 0) > (before.lastAt || 0) && after.lastFrom) {
    const fromProvider = after.lastFrom === after.ownerId;
    to = fromProvider ? after.fromId : after.ownerId;
    title = fromProvider ? (after.providerName || 'Provider') : (after.fromName || 'Customer');
    body = after.lastMsg || 'New message';
  } else {
    return; // only "seen" markers changed
  }
  if (!to) return;

  const ref = admin.firestore().doc(`users/${to}/private/push`);
  const snap = await ref.get();
  const tokens = (snap.exists && Array.isArray(snap.data().tokens)) ? snap.data().tokens : [];
  if (!tokens.length) return;

  const res = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title, body: String(body).slice(0, 180) },
    webpush: {
      notification: { icon: ICON, badge: ICON, tag: event.params.id, renotify: true },
      fcmOptions: { link: INBOX },
    },
  });
  const stale = [];
  res.responses.forEach((r, i) => { if (!r.success && STALE.includes(r.error && r.error.code)) stale.push(tokens[i]); });
  if (stale.length) await ref.update({ tokens: admin.firestore.FieldValue.arrayRemove(...stale) });
});
