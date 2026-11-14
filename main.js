(() => {
  // 첫 화면 검색창: 실제 사례 검색어를 번갈아 보여 준다
  const q = document.getElementById('query');
  const words = ['안락동 맛집', '서면 사주', '우리 동네 가게'];
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (q && !still) {
    let w = 0, i = words[0].length, del = true;
    const tick = () => {
      const word = words[w];
      if (del) { i--; if (i <= 0) { del = false; w = (w + 1) % words.length; } }
      else { i++; if (i >= words[w].length) { del = true; q.textContent = words[w]; return setTimeout(tick, 2200); } }
      q.textContent = words[w].slice(0, Math.max(0, i)) || ' ';
      setTimeout(tick, del ? 60 : 130);
    };
    setTimeout(tick, 2400);
  }

  // 문의 폼
  const form = document.getElementById('inquiry-form');
  const out = document.getElementById('form-msg');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = form.elements;
    const data = {
      name: f.name.value.trim(),
      contact: f.contact.value.trim(),
      store: f.store.value.trim(),
      website: f.website.value,
      consent: f.consent.checked,
    };
    out.className = 'form-msg err';
    if (!data.name || !data.contact) { out.textContent = '이름과 연락처를 적어 주세요.'; (data.name ? f.contact : f.name).focus(); return; }
    if (!data.consent) { out.textContent = '개인정보 수집·이용에 동의해 주세요.'; f.consent.focus(); return; }
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = '보내는 중…'; out.textContent = '';
    try {
      const r = await fetch('/api/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || '보내지 못했어요. 잠시 뒤 다시 시도하거나 카카오톡으로 문의해 주세요.');
      form.reset();
      out.className = 'form-msg ok';
      out.textContent = '문의가 접수됐어요. 확인 후 연락드릴게요.';
    } catch (err) {
      out.textContent = err.message || '보내지 못했어요. 잠시 뒤 다시 시도하거나 카카오톡으로 문의해 주세요.';
    } finally {
      btn.disabled = false; btn.textContent = '문의 남기기';
    }
  });
})();
