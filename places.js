// Philippine provinces with their main cities and towns, grouped by region.
// Providers can still type any city or town; this list powers the area pickers.
self.PH_PLACES = [
  {region:'Metro Manila', provinces:[{name:'Metro Manila', areas:['Caloocan','Las Piñas','Makati','Malabon','Mandaluyong','Manila','Marikina','Muntinlupa','Navotas','Parañaque','Pasay','Pasig','Pateros','Quezon City','San Juan','Taguig','Valenzuela']}]},
  {region:'Cordillera (CAR)', provinces:[
    {name:'Abra', areas:['Bangued']},{name:'Apayao', areas:['Kabugao','Luna']},{name:'Benguet', areas:['Baguio','La Trinidad','Itogon']},
    {name:'Ifugao', areas:['Lagawe','Banaue']},{name:'Kalinga', areas:['Tabuk']},{name:'Mountain Province', areas:['Bontoc','Sagada']}]},
  {region:'Ilocos Region', provinces:[
    {name:'Ilocos Norte', areas:['Laoag','Batac','Pagudpud']},{name:'Ilocos Sur', areas:['Vigan','Candon']},
    {name:'La Union', areas:['San Fernando','San Juan','Bauang']},{name:'Pangasinan', areas:['Dagupan','Alaminos','San Carlos','Urdaneta','Lingayen']}]},
  {region:'Cagayan Valley', provinces:[
    {name:'Batanes', areas:['Basco']},{name:'Cagayan', areas:['Tuguegarao','Aparri']},{name:'Isabela', areas:['Ilagan','Cauayan','Santiago']},
    {name:'Nueva Vizcaya', areas:['Bayombong','Solano']},{name:'Quirino', areas:['Cabarroguis']}]},
  {region:'Central Luzon', provinces:[
    {name:'Aurora', areas:['Baler']},{name:'Bataan', areas:['Balanga','Mariveles']},{name:'Bulacan', areas:['Malolos','Meycauayan','San Jose del Monte','Marilao','Santa Maria']},
    {name:'Nueva Ecija', areas:['Cabanatuan','Gapan','Muñoz','Palayan','San Jose']},{name:'Pampanga', areas:['Angeles','San Fernando','Mabalacat','Clark']},
    {name:'Tarlac', areas:['Tarlac City','Capas']},{name:'Zambales', areas:['Olongapo','Subic','Iba']}]},
  {region:'CALABARZON', provinces:[
    {name:'Batangas', areas:['Batangas City','Lipa','Tanauan','Santo Tomas','Calaca','Nasugbu']},
    {name:'Cavite', areas:['Bacoor','Imus','Dasmariñas','General Trias','Cavite City','Tagaytay','Trece Martires','Carmona','Silang']},
    {name:'Laguna', areas:['Calamba','Santa Rosa','Biñan','Cabuyao','San Pedro','San Pablo','Los Baños']},
    {name:'Quezon', areas:['Lucena','Tayabas']},{name:'Rizal', areas:['Antipolo','Cainta','Taytay','San Mateo','Rodriguez']}]},
  {region:'MIMAROPA', provinces:[
    {name:'Marinduque', areas:['Boac']},{name:'Occidental Mindoro', areas:['Mamburao','San Jose']},{name:'Oriental Mindoro', areas:['Calapan','Puerto Galera']},
    {name:'Palawan', areas:['Puerto Princesa','El Nido','Coron']},{name:'Romblon', areas:['Romblon','Odiongan']}]},
  {region:'Bicol Region', provinces:[
    {name:'Albay', areas:['Legazpi','Ligao','Tabaco','Daraga']},{name:'Camarines Norte', areas:['Daet']},{name:'Camarines Sur', areas:['Naga','Iriga','Pili']},
    {name:'Catanduanes', areas:['Virac']},{name:'Masbate', areas:['Masbate City']},{name:'Sorsogon', areas:['Sorsogon City']}]},
  {region:'Western Visayas', provinces:[
    {name:'Aklan', areas:['Kalibo','Malay (Boracay)']},{name:'Antique', areas:['San Jose de Buenavista']},{name:'Capiz', areas:['Roxas City']},
    {name:'Guimaras', areas:['Jordan']},{name:'Iloilo', areas:['Iloilo City','Passi','Oton','Pavia']}]},
  {region:'Negros Island Region', provinces:[
    {name:'Negros Occidental', areas:['Bacolod','Silay','Talisay','Bago','Kabankalan','San Carlos','Victorias','Cadiz','Sagay']},
    {name:'Negros Oriental', areas:['Dumaguete','Bais','Bayawan','Tanjay','Guihulngan','Canlaon']},{name:'Siquijor', areas:['Siquijor','Larena']}]},
  {region:'Central Visayas', provinces:[
    {name:'Bohol', areas:['Tagbilaran','Panglao','Dauis']},
    {name:'Cebu', areas:['Cebu City','Mandaue','Lapu-Lapu','Talisay','Consolacion','Liloan','Minglanilla','Cordova','Naga','Danao','Carcar','Toledo','Bogo','Compostela','Moalboal','Oslob','Bantayan']}]},
  {region:'Eastern Visayas', provinces:[
    {name:'Biliran', areas:['Naval']},{name:'Eastern Samar', areas:['Borongan']},{name:'Leyte', areas:['Tacloban','Ormoc','Baybay','Palo']},
    {name:'Northern Samar', areas:['Catarman']},{name:'Samar', areas:['Calbayog','Catbalogan']},{name:'Southern Leyte', areas:['Maasin']}]},
  {region:'Zamboanga Peninsula', provinces:[
    {name:'Zamboanga del Norte', areas:['Dipolog','Dapitan']},{name:'Zamboanga del Sur', areas:['Zamboanga City','Pagadian']},{name:'Zamboanga Sibugay', areas:['Ipil']}]},
  {region:'Northern Mindanao', provinces:[
    {name:'Bukidnon', areas:['Malaybalay','Valencia']},{name:'Camiguin', areas:['Mambajao']},{name:'Lanao del Norte', areas:['Iligan']},
    {name:'Misamis Occidental', areas:['Ozamiz','Oroquieta','Tangub']},{name:'Misamis Oriental', areas:['Cagayan de Oro','El Salvador','Gingoog','Opol']}]},
  {region:'Davao Region', provinces:[
    {name:'Davao de Oro', areas:['Nabunturan']},{name:'Davao del Norte', areas:['Tagum','Panabo','Island Garden City of Samal']},
    {name:'Davao del Sur', areas:['Davao City','Digos']},{name:'Davao Occidental', areas:['Malita']},{name:'Davao Oriental', areas:['Mati']}]},
  {region:'SOCCSKSARGEN', provinces:[
    {name:'Cotabato', areas:['Kidapawan']},{name:'Sarangani', areas:['Alabel']},{name:'South Cotabato', areas:['General Santos','Koronadal']},{name:'Sultan Kudarat', areas:['Tacurong','Isulan']}]},
  {region:'Caraga', provinces:[
    {name:'Agusan del Norte', areas:['Butuan','Cabadbaran']},{name:'Agusan del Sur', areas:['Bayugan']},{name:'Dinagat Islands', areas:['San Jose']},
    {name:'Surigao del Norte', areas:['Surigao City','General Luna (Siargao)']},{name:'Surigao del Sur', areas:['Tandag','Bislig']}]},
  {region:'BARMM', provinces:[
    {name:'Basilan', areas:['Isabela City','Lamitan']},{name:'Lanao del Sur', areas:['Marawi']},{name:'Maguindanao del Norte', areas:['Cotabato City','Datu Odin Sinsuat']},
    {name:'Maguindanao del Sur', areas:['Buluan']},{name:'Sulu', areas:['Jolo']},{name:'Tawi-Tawi', areas:['Bongao']}]}
];
self.PH_PROVINCES = self.PH_PLACES.flatMap(r => r.provinces.map(p => p.name));
self.phProvinceOf = function (area) {
  const a = String(area || '').trim().toLowerCase(); if (!a) return '';
  // Cebu first: Renta.ph started there, and some names (Talisay, Naga) exist in more than one province
  const order = self.PH_PLACES.flatMap(r => r.provinces).sort((x, y) => (y.name === 'Cebu') - (x.name === 'Cebu'));
  for (const p of order) if (p.areas.some(x => x.toLowerCase() === a) || p.name.toLowerCase() === a) return p.name;
  return '';
};
