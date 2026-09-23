// HTML Canvas Studio visual edits
(() => {
  window.hcsEditorVersion=2;
  const changes = [];
  const styles = document.createElement('style');
  styles.textContent = '@keyframes hcsFade{from{opacity:0}to{opacity:1}}@keyframes hcsLeft{from{opacity:0;transform:translateX(-36px)}to{opacity:1;transform:translateX(0)}}@keyframes hcsUp{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}@keyframes hcsZoom{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}@keyframes hcsWiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-3deg)}75%{transform:rotate(3deg)}}';
  (document.head || document.documentElement).appendChild(styles);

  const apply = (change, index) => {
    const element = document.querySelector(change.selector);
    if (!element) return;
    if (change.action === 'insert') {
      if (!document.querySelector('[data-hcs-created="' + change.id + '"]')) element.insertAdjacentHTML('afterend', change.html);
      return;
    }
    if (change.action === 'move-up' || change.action === 'move-down') {
      const marker = 'hcsMove' + index;
      if (element.dataset[marker]) return;
      const sibling = change.action === 'move-up' ? element.previousElementSibling : element.nextElementSibling;
      if (sibling) {
        if (change.action === 'move-up') sibling.before(element);
        else sibling.after(element);
        element.dataset[marker] = '1';
      }
      return;
    }
    if (change.action === 'delete') {
      element.remove();
      return;
    }
    if (change.action === 'copy') {
      if (!document.querySelector(`[data-hcs-clone="${index}"]`)) {
        const clone = element.cloneNode(true);
        clone.setAttribute('data-hcs-clone', String(index));
        element.after(clone);
      }
      return;
    }
    if (change.text !== null && element.textContent !== change.text) element.textContent = change.text;
    if (change.href !== null && element.getAttribute('href') !== change.href) element.setAttribute('href', change.href);
    if (change.src !== null && element.getAttribute('src') !== change.src) element.setAttribute('src', change.src);
    for (const [name, value] of Object.entries(change.styles || {})) {
      if (element.style.getPropertyValue(name) !== value) element.style.setProperty(name, value);
    }
  };

  let queued = false;
  const applyAll = () => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
  window.hcsEditorVersion=2;
      queued = false;
      changes.forEach(apply);
    });
  };
  window.hcsApply = (change) => {
    changes.push(change);
    applyAll();
  };
  new MutationObserver(applyAll).observe(document.documentElement, { childList: true, subtree: true });
  addEventListener('DOMContentLoaded', applyAll);
  addEventListener('load', applyAll);
})();

window.hcsApply({"selector":"#finderTitle","action":"edit","text":"안녕하세요","href":null,"src":null,"styles":{}});
