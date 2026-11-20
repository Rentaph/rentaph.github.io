// "How it works" guide shared by the website and the app.
(function () {
  const css = `
  .guide{display:flex;flex-direction:column;gap:16px}
  .gseg{display:inline-flex;align-self:flex-start;background:#fff;border:1px solid #dfe2da;border-radius:14px;padding:4px;gap:4px;flex-wrap:wrap}
  .gseg button{border:0;background:none;padding:10px 16px;border-radius:11px;font:700 15px "Figtree","Segoe UI",system-ui,sans-serif;color:#56606e;cursor:pointer}
  .gseg button[aria-pressed="true"]{background:#0e5a5f;color:#fff}
  .gintro{margin:0;color:#56606e;font-size:16px;line-height:1.5}
  .gsteps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;counter-reset:g}
  .gsteps>li{background:#fff;border:1px solid #dfe2da;border-radius:18px;padding:16px 16px 16px 64px;position:relative;font-size:15.5px;line-height:1.5;color:#152030;counter-increment:g}
  .gsteps>li::before{content:counter(g);position:absolute;left:16px;top:16px;width:34px;height:34px;border-radius:11px;background:#152030;color:#fff;display:grid;place-items:center;font:800 17px "Bricolage Grotesque",system-ui,sans-serif}
  .gsteps>li b{display:block;font-size:16.5px;margin-bottom:2px}
  .gsteps>li ul{margin:6px 0 0;padding-left:18px;color:#56606e;list-style:disc}
  .gsteps>li ul li{background:none;border:0;padding:0;margin:2px 0;counter-increment:none;font-size:15px}
  .gsteps>li ul li::before{content:none}
  .gsteps li .k{display:inline-block;background:#dcefeb;color:#0e5a5f;font-weight:700;border-radius:7px;padding:0 7px}
  .gtips{background:#f6efd9;border:1px solid #ecdcae;border-radius:18px;padding:16px 18px;font-size:15px;line-height:1.55;color:#152030}
  .gtips b{display:block;margin-bottom:4px}
  .gtips ul{margin:0;padding-left:18px}
  .gpane[hidden]{display:none}`;
  const k = t => `<span class="k">${t}</span>`;
  const buyer = `
  <p class="gintro">Find a service, rent a vehicle or a place, or order from a local seller.</p>
  <ol class="gsteps">
    <li><b>Open Renta.ph</b>Go to rentaph.web.app and tap ${k('Open the app')}, or open the Android app.</li>
    <li><b>Search what you need</b>Type something like “plumber”, “aircon” or “room”. Choose a category and your Province, City and Barangay.</li>
    <li><b>Check the listing</b>Tap a listing to see the photos, price, location, map and ratings.</li>
    <li><b>Tap the request button</b>${k('Book this service')}, ${k('Request to rent')}, ${k('Request a viewing')} or ${k('Order / reserve')}.</li>
    <li><b>Add your details</b>Sign in if asked. Add your date, your address (for services and deliveries), a short message and your mobile number.</li>
    <li><b>Send the request</b>Tap ${k('Send request')}. It goes straight to the provider.</li>
    <li><b>Chat in your Inbox</b>Check ${k('Inbox')} for the reply. Agree on the details and payment directly with the provider.</li>
    <li><b>Rate the provider</b>After the job, tap ${k('Rate')} to leave stars and a short comment. It helps others in your community.</li>
  </ol>`;
  const seller = `
  <p class="gintro">List your service, room, vehicle or products for free and get requests on your phone. No commission.</p>
  <ol class="gsteps">
    <li><b>Open Renta.ph</b>Go to rentaph.web.app and tap ${k('Open the app')}, or open the Android app.</li>
    <li><b>Sign in</b>Tap ${k('Sign in')} at the top right. Use your Google account, or “Create an account” with your email.</li>
    <li><b>Start a listing</b>Tap ${k('My listings')} at the bottom, then ${k('Post a listing')}.</li>
    <li><b>Set up your profile</b>Type your business or display name and your mobile number, then tap ${k('Save profile')}.</li>
    <li><b>Fill in your listing</b><ul><li>What you offer: Services, Car &amp; motor rental, Apartments or Products</li><li>Type, title and your price</li><li>Province, City/Municipality and Barangay</li><li>Optional: pin your location on the map</li><li>Details like inclusions, schedule and requirements</li><li>Up to 6 clear photos</li></ul></li>
    <li><b>Post it</b>Tap ${k('Post listing')}. Your listing is now live for everyone to see.</li>
    <li><b>Answer requests</b>New requests show in your ${k('Inbox')}. Chat with the customer, then tap ${k('Accept')} or ${k('Decline')}.</li>
    <li><b>Finish the job</b>When it’s done, tap ${k('Mark completed')} so the customer can rate you. Good ratings help you get more customers.</li>
  </ol>`;
  const tips = `<div class="gtips"><b>Tips</b><ul>
    <li>You can also call or text the provider using the number on the listing.</li>
    <li>Tap ${k('Save')} to keep listings you like.</li>
    <li>For rentals, always check IDs and documents before paying.</li>
    <li>Renta.ph is free for everyone, with no commission. Made to support local businesses.</li></ul></div>`;
  self.renderRentaGuide = function (el, start) {
    if (!document.getElementById('guide-css')) { const s = document.createElement('style'); s.id = 'guide-css'; s.textContent = css; document.head.appendChild(s); }
    const tab = start === 'seller' ? 'seller' : 'buyer';
    el.innerHTML = `<div class="guide">
      <div class="gseg" role="group" aria-label="Guide for">
        <button type="button" data-g="buyer" aria-pressed="${tab === 'buyer'}">I want to book or buy</button>
        <button type="button" data-g="seller" aria-pressed="${tab === 'seller'}">I want to list</button>
      </div>
      <div class="gpane" data-p="buyer" ${tab === 'buyer' ? '' : 'hidden'}>${buyer}</div>
      <div class="gpane" data-p="seller" ${tab === 'seller' ? '' : 'hidden'}>${seller}</div>
      ${tips}</div>`;
    el.querySelector('.gseg').addEventListener('click', e => {
      const b = e.target.closest('[data-g]'); if (!b) return;
      el.querySelectorAll('[data-g]').forEach(x => x.setAttribute('aria-pressed', x === b));
      el.querySelectorAll('[data-p]').forEach(p => { p.hidden = p.dataset.p !== b.dataset.g; });
    });
  };
})();
