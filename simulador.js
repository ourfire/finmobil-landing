// Simulador de inversión — Finmobil
// Interés simple sobre el capital, capital al vencimiento.
(function () {
  'use strict';

  var MIN_RATE = 6;
  var MAX_RATE = 24;

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    currency: $('sim-moneda'),
    amount: $('sim-monto'),
    rate: $('sim-tasa'),
    rateRange: $('sim-tasa-rango'),
    rateWarn: $('sim-tasa-aviso'),
    term: $('sim-plazo'),
    freqGroup: $('sim-freq'),
    perLabel: $('out-per-label'),
    per: $('out-per'),
    interest: $('out-int'),
    total: $('out-total'),
    note: $('out-note'),
    wrap: $('sched-wrap'),
    rows: $('sched-rows'),
    empty: $('sched-empty'),
    totInt: $('tot-int'),
    totCap: $('tot-cap'),
    totAll: $('tot-all')
  };
  if (!el.amount) return;

  var FREQ_LABEL = { 1: 'Pago mensual', 3: 'Pago trimestral', 6: 'Pago semestral', 0: 'Intereses al vencimiento' };
  var freq = 1;

  function fmt(n) {
    var c = el.currency.value;
    var locale = 'en-US'; // separador de miles con coma en todas las monedas
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency', currency: c, maximumFractionDigits: c === 'COP' ? 0 : 2
      }).format(n);
    } catch (e) {
      return c + ' ' + Math.round(n);
    }
  }

  function cell(text) {
    var s = document.createElement('span');
    s.textContent = text;
    return s;
  }

  function render() {
    var amount = parseAmount(el.amount.value);
    var rate = parseFloat(el.rate.value);
    var term = parseInt(el.term.value, 10);
    var outOfRange = rate > 0 && (rate < MIN_RATE || rate > MAX_RATE);

    el.rateWarn.hidden = !outOfRange;
    el.rate.classList.toggle('err', outOfRange);
    el.rate.setAttribute('aria-invalid', outOfRange ? 'true' : 'false');
    el.perLabel.textContent = FREQ_LABEL[freq];

    var ok = amount > 0 && rate > 0 && !outOfRange && term > 0;
    el.rows.textContent = '';

    if (!ok) {
      el.per.textContent = el.interest.textContent = el.total.textContent = '—';
      el.note.textContent = '';
      el.wrap.hidden = true;
      el.empty.hidden = false;
      return;
    }

    var step = freq === 0 ? term : freq;
    var totalInt = amount * rate / 100 * term / 12;
    var month = 0, cum = 0, count = 0;
    var frag = document.createDocumentFragment();

    while (month < term) {
      var next = Math.min(month + step, term);
      var it = amount * rate / 100 * (next - month) / 12;
      var last = next >= term;
      var pay = it + (last ? amount : 0);
      cum += pay;
      count++;
      var row = document.createElement('div');
      row.className = 'row';
      row.appendChild(cell('Mes ' + next));
      row.appendChild(cell(fmt(it)));
      row.appendChild(cell(last ? fmt(amount) : '—'));
      row.appendChild(cell(fmt(pay)));
      row.appendChild(cell(fmt(cum)));
      frag.appendChild(row);
      month = next;
    }

    el.rows.appendChild(frag);
    el.per.textContent = fmt(amount * rate / 100 * step / 12);
    el.interest.textContent = fmt(totalInt);
    el.total.textContent = fmt(amount + totalInt);
    el.totInt.textContent = fmt(totalInt);
    el.totCap.textContent = fmt(amount);
    el.totAll.textContent = fmt(amount + totalInt);
    el.note.textContent = count + (count === 1 ? ' pago' : ' pagos') + ' · capital al vencimiento';
    el.wrap.hidden = false;
    el.empty.hidden = true;
  }

  el.rate.addEventListener('input', function () {
    var r = parseFloat(el.rate.value);
    if (r >= MIN_RATE && r <= MAX_RATE) el.rateRange.value = r;
    render();
  });
  el.rateRange.addEventListener('input', function () {
    el.rate.value = el.rateRange.value;
    render();
  });
  // Monto con separador de miles (coma) mientras se escribe
  function parseAmount(v) { return parseFloat(String(v).replace(/[^\d]/g, '')); }
  function groupDigits(d) { return d.replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  el.amount.addEventListener('input', function () {
    var raw = el.amount.value;
    var caret = el.amount.selectionStart || raw.length;
    var digitsBefore = raw.slice(0, caret).replace(/[^\d]/g, '').length;
    var digits = raw.replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '').slice(0, 15);
    var formatted = groupDigits(digits);
    el.amount.value = formatted;
    var pos = 0, seen = 0;
    while (pos < formatted.length && seen < digitsBefore) { if (/\d/.test(formatted[pos])) seen++; pos++; }
    try { el.amount.setSelectionRange(pos, pos); } catch (e) {}
  });

  [el.amount, el.term, el.currency].forEach(function (input) {
    input.addEventListener('input', render);
    input.addEventListener('change', render);
  });
  el.freqGroup.addEventListener('click', function (e) {
    var btn = e.target.closest('.freq');
    if (!btn) return;
    freq = parseInt(btn.getAttribute('data-f'), 10);
    Array.prototype.forEach.call(el.freqGroup.querySelectorAll('.freq'), function (b) {
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });
    render();
  });

  render();
})();
