(async function(){
  // Interface visual
  const barra = document.createElement('div');
  Object.assign(barra.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '0%',
    height: '8px',
    backgroundColor: '#ff0000',
    zIndex: 999999,
    transition: 'width 0.3s ease'
  });
  document.body.appendChild(barra);

  const botaoPausar = document.createElement('button');
  botaoPausar.textContent = '⏸️ Parar';
  Object.assign(botaoPausar.style, {
    position: 'fixed',
    top: '10px',
    right: '10px',
    zIndex: 999999,
    padding: '8px 12px',
    fontSize: '14px',
    background: '#fff',
    border: '1px solid #ccc',
    cursor: 'pointer'
  });
  document.body.appendChild(botaoPausar);

  let interrompido = false;
  botaoPausar.onclick = () => {
    interrompido = true;
    botaoPausar.textContent = '⏹️ Interrompido';
    botaoPausar.disabled = true;
    botaoPausar.style.background = '#ddd';
  };

  // Função de espera
  const delay = ms => new Promise(res => setTimeout(res, ms));

  // Rolar até carregar tudo
  async function scrollAteOFim() {
    let alturaAnterior = 0;
    while (!interrompido) {
      window.scrollTo(0, document.body.scrollHeight);
      await delay(1000);
      let alturaAtual = document.body.scrollHeight;
      if (alturaAtual === alturaAnterior) break;
      alturaAnterior = alturaAtual;
    }
    console.log('🔽 Rolagem completa.');
  }

  await scrollAteOFim();

  const videos = Array.from(document.querySelectorAll('ytd-playlist-video-renderer'));
  const total = videos.length;
  console.log(`🎞️ ${total} vídeos detectados.`);

  for (let i = 0; i < total; i++) {
    if (interrompido) {
      console.warn('⛔ Execução interrompida pelo usuário.');
      break;
    }

    const video = videos[i];
    const menuBtn = video.querySelector('button[aria-label="Menu de ações"]');
    if (!menuBtn) {
      console.warn(`⚠️ Menu não encontrado no vídeo ${i + 1}`);
      continue;
    }

    menuBtn.click();
    await delay(600);

    const removerBtn = Array.from(document.querySelectorAll('ytd-menu-service-item-renderer yt-formatted-string'))
      .find(el => el.innerText.trim().includes('Remover de Assistir mais tarde'));

    if (removerBtn) {
      removerBtn.click();
      console.log(`🗑️ Vídeo ${i + 1} removido.`);
      await delay(1000);
    } else {
      console.warn(`⚠️ Botão "Remover" não encontrado para o vídeo ${i + 1}`);
    }

    // Atualiza a barra de progresso
    barra.style.width = `${((i + 1) / total) * 100}%`;
  }

  console.log('✅ Remoção concluída.');
  if (!interrompido) botaoPausar.remove();
})();
