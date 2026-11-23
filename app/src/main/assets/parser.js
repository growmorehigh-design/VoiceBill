// Tamil / Tanglish / English voice text -> bill data
(function (root) {
  const NUM = {
    'ஒரு': 1, 'ஒன்று': 1, 'ஒன்னு': 1, 'ஓர்': 1, 'one': 1,
    'இரண்டு': 2, 'ரெண்டு': 2, 'இரு': 2, 'two': 2,
    'மூன்று': 3, 'மூணு': 3, 'three': 3,
    'நான்கு': 4, 'நாலு': 4, 'four': 4,
    'ஐந்து': 5, 'அஞ்சு': 5, 'அஞ்சி': 5, 'five': 5,
    'ஆறு': 6, 'six': 6, 'ஏழு': 7, 'seven': 7, 'எட்டு': 8, 'eight': 8,
    'ஒன்பது': 9, 'nine': 9, 'பத்து': 10, 'ten': 10,
    'இருபது': 20, 'முப்பது': 30, 'நாற்பது': 40, 'ஐம்பது': 50, 'அம்பது': 50, 'நூறு': 100, 'hundred': 100
  };
  const THOUSANDS = {
    'ரெண்டாயிரம்': 2000, 'இரண்டாயிரம்': 2000, 'மூவாயிரம்': 3000, 'மூணாயிரம்': 3000,
    'நாலாயிரம்': 4000, 'நான்காயிரம்': 4000, 'ஐந்தாயிரம்': 5000, 'அஞ்சாயிரம்': 5000, 'ஆறாயிரம்': 6000,
    'ஏழாயிரம்': 7000, 'எட்டாயிரம்': 8000, 'ஒன்பதாயிரம்': 9000, 'பத்தாயிரம்': 10000,
    'இருபதாயிரம்': 20000, 'முப்பதாயிரம்': 30000, 'ஐம்பதாயிரம்': 50000, 'அம்பதாயிரம்': 50000
  };
  const MULT = { 'ஆயிரம்': 1000, 'ஆயிரத்து': 1000, 'thousand': 1000, 'தவுசண்ட்': 1000, 'லட்சம்': 100000, 'லட்சத்து': 100000, 'lakh': 100000, 'lakhs': 100000, 'லாக்': 100000 };
  const UNITS = {
    'செட்': 'Set', 'set': 'Set', 'sets': 'Set', 'செட்டு': 'Set',
    'நம்பர்': 'Nos', 'நம்பர்ஸ்': 'Nos', 'நோஸ்': 'Nos', 'நாஸ்': 'Nos', 'nos': 'Nos', 'no': 'Nos', 'number': 'Nos', 'numbers': 'Nos', 'எண்ணம்': 'Nos', 'எண்': 'Nos',
    'பீஸ்': 'Pcs', 'pcs': 'Pcs', 'piece': 'Pcs', 'pieces': 'Pcs', 'பீசு': 'Pcs',
    'மீட்டர்': 'Mtr', 'meter': 'Mtr', 'metre': 'Mtr', 'mtr': 'Mtr', 'அடி': 'Ft', 'feet': 'Ft',
    'லிட்டர்': 'Ltr', 'litre': 'Ltr', 'liter': 'Ltr', 'ltr': 'Ltr',
    'கிலோ': 'Kg', 'kg': 'Kg', 'kilo': 'Kg',
    'மணி': 'Hrs', 'மணிநேரம்': 'Hrs', 'hours': 'Hrs', 'hour': 'Hrs', 'hrs': 'Hrs',
    'நாள்': 'Day', 'நாளு': 'Day', 'day': 'Day', 'days': 'Day', 'டே': 'Day',
    'லாட்': 'Lot', 'lot': 'Lot', 'ஜாப்': 'Job', 'job': 'Job'
  };
  const RUPEE = /^(ரூபாய்|ரூபாய்க்கு|ரூபா|ரூ|ருபீஸ்|ரூபீஸ்|rs|rs\.|rupees|rupee|₹|ருபாய்)$/;
  const RATE = /^(ரேட்|rate|விலை|ஒன்னுக்கு|ஒன்றுக்கு|ஒண்ணுக்கு|each|per)$/;
  const FILLER = /^(அடுத்து|அப்புறம்|அப்பறம்|மற்றும்|and|then|next|ஐட்டம்|item|அப்புறமா|பிறகு|ok|ஓகே|சரி|டோட்டல்|total)$/;
  const CUST = /^(கஸ்டமர்|கஸ்டமர்ஸ்|customer|வாடிக்கையாளர்|பார்ட்டி|party|கம்பெனி)$/;
  const SHOP = /^(வொர்க்ஷாப்|ஒர்க்ஷாப்|வர்க்ஷாப்|workshop|ஷாப்|shop|கடை)$/;
  const NAMEW = /^(நேம்|பெயர்|பேரு|பேர்|name|பெயர்|:|-|is)$/;
  const SUFFIX = /^(கேர்|care|சர்வீஸ்|சர்வீசஸ்|service|services|இண்டஸ்ட்ரீஸ்|industries|என்டர்பிரைசஸ்|எண்டர்பிரைசஸ்|enterprises|டிரேடர்ஸ்|ட்ரேடர்ஸ்|traders|மோட்டார்ஸ்|motors|ஏஜென்சி|ஏஜென்சீஸ்|agency|agencies|ட்ரான்ஸ்போர்ட்|டிரான்ஸ்போர்ட்|transport|ஸ்டோர்ஸ்|stores|ஒர்க்ஸ்|வொர்க்ஸ்|works|லிமிடெட்|limited|ltd|கம்பெனி|company|co|இன்ஜினியரிங்|engineering|கார்ப்பரேஷன்|corporation|மில்ஸ்|mills|டெக்|tech|சொல்யூஷன்ஸ்|solutions|கிரேன்ஸ்|cranes)$/;
  const STOPNAME = /^(அவர்களுக்கு|அவங்களுக்கு|க்கு|சார்|sir)$/;

  function normalize(text) {
    let t = ' ' + String(text || '').toLowerCase() + ' ';
    t = t.replace(/(\d),(?=\d)/g, '$1');
    t = t.replace(/₹\s*/g, ' ரூ ');
    t = t.replace(/rs\.?\s*(?=\d)/g, ' rs ');
    t = t.replace(/(\d)([^\d\s.,])/g, '$1 $2').replace(/([^\d\s.,₹])(\d)/g, '$1 $2');
    t = t.replace(/([,.;!?])(?!\d)/g, ' . ');
    let toks = t.split(/\s+/).filter(Boolean);
    // words -> numbers
    toks = toks.map(w => {
      if (THOUSANDS[w] != null) return String(THOUSANDS[w]);
      if (NUM[w] != null) return String(NUM[w]);
      return w;
    });
    // combine "25 ஆயிரம்", "25 ஆயிரத்து 500"
    const out = [];
    for (let i = 0; i < toks.length; i++) {
      const w = toks[i];
      if (MULT[w] && out.length && isNum(out[out.length - 1])) {
        let v = parseFloat(out.pop()) * MULT[w];
        if (/த்து$/.test(w) && isNum(toks[i + 1])) { v += parseFloat(toks[i + 1]); i++; }
        out.push(String(v));
      } else if (MULT[w] && !/த்து$/.test(w)) {
        out.push(String(MULT[w]));
      } else out.push(w);
    }
    return out;
  }
  function isNum(w) { return w != null && /^\d+(\.\d+)?$/.test(w); }

  function grabName(toks, i) {
    // toks[i] is first token after the keyword
    while (i < toks.length && NAMEW.test(toks[i])) i++;
    const start = i, words = [];
    for (; i < toks.length && words.length < 6; i++) {
      const w = toks[i];
      if (w === '.' || isNum(w) || FILLER.test(w)) break;
      if (STOPNAME.test(w)) { i++; break; }
      words.push(w);
      if (SUFFIX.test(w)) { i++; break; }
    }
    // no suffix found and no stop -> keep at most 2 words
    if (words.length > 1 && !SUFFIX.test(words[words.length - 1]) && !(toks[i] === '.' || STOPNAME.test(toks[i - 1] || ''))) {
      return { name: words[0], end: start + 1 };
    }
    return { name: words.join(' '), end: i };
  }

  function titleCase(s) { return s.replace(/\b[a-z]/g, c => c.toUpperCase()); }

  function parse(text) {
    const toks = normalize(text);
    const res = { customer: '', shop: '', items: [] };
    const used = new Array(toks.length).fill(false);
    for (let i = 0; i < toks.length; i++) {
      const isC = CUST.test(toks[i]) && (NAMEW.test(toks[i + 1] || '') || !res.customer);
      const isS = SHOP.test(toks[i]) && NAMEW.test(toks[i + 1] || '');
      if (isC || isS) {
        const g = grabName(toks, i + 1);
        if (g.name) {
          if (isC) res.customer = titleCase(g.name); else res.shop = titleCase(g.name);
          for (let k = i; k < g.end; k++) used[k] = true;
          i = g.end - 1;
        }
      }
    }
    let desc = [], qty = null, unit = '', rateMode = false;
    const push = (amount, isRate) => {
      const d = desc.join(' ').trim();
      const q = qty || 1;
      if (!d && !res.items.length) { desc = []; qty = null; unit = ''; return; }
      if (!d && res.items.length && res.items[res.items.length - 1].amount === 0) {
        const last = res.items[res.items.length - 1];
        last.amount = isRate ? amount * last.qty : amount;
      } else {
        res.items.push({ desc: titleCase(d || 'Item'), qty: q, unit: unit || 'Nos', amount: isRate ? amount * q : amount });
      }
      desc = []; qty = null; unit = ''; rateMode = false;
    };
    for (let i = 0; i < toks.length; i++) {
      if (used[i]) continue;
      const w = toks[i];
      if (w === '.' || FILLER.test(w)) {
        if (desc.length && qty == null && w === '.') continue;
        continue;
      }
      if (RUPEE.test(w)) continue;
      if (RATE.test(w)) { rateMode = true; continue; }
      if (isNum(w)) {
        const n = parseFloat(w);
        const nx = toks[i + 1];
        if (nx && UNITS[nx] && qty == null) { qty = n; unit = UNITS[nx]; i++; continue; }
        push(n, rateMode);
        continue;
      }
      if (UNITS[w] && qty == null && desc.length) { unit = UNITS[w]; continue; }
      desc.push(w);
    }
    if (desc.length) {
      res.items.push({ desc: titleCase(desc.join(' ')), qty: qty || 1, unit: unit || 'Nos', amount: 0 });
    }
    return res;
  }

  function words(num) {
    num = Math.round(num);
    if (num === 0) return 'Zero';
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const two = n => n < 20 ? a[n] : b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
    const three = n => (n >= 100 ? a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' : '') : '') + (n % 100 ? two(n % 100) : '');
    const parts = [];
    const cr = Math.floor(num / 10000000); num %= 10000000;
    const lk = Math.floor(num / 100000); num %= 100000;
    const th = Math.floor(num / 1000); num %= 1000;
    if (cr) parts.push(three(cr) + ' Crore');
    if (lk) parts.push(two(lk) + ' Lakh');
    if (th) parts.push(two(th) + ' Thousand');
    if (num) parts.push(three(num));
    return parts.join(' ');
  }

  const api = { parse, normalize, words };
  if (typeof module !== 'undefined') module.exports = api; else root.VoiceParser = api;
})(this);
