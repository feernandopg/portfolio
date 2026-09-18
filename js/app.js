/* =============================================================================
   PG SYSTEMS · Portfólio — interações
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. terminal de validação de licença ─────────────────────────────── */
  var ROTEIRO = [
    { kind: 'out',  txt: 'POST  https://…/api/validate' },
    { kind: 'pair', k: 'key',            v: 'GRG-1046-A7F2-11C4' },
    { kind: 'pair', k: 'machine_id',     v: '8f3c9a21…d41b' },
    { kind: 'pair', k: 'product',        v: 'garage106' },
    { kind: 'pair', k: 'client_version', v: '1.2' },
    { kind: 'out',  txt: '' },
    { kind: 'ok',   txt: '200  payload assinado (Ed25519)' },
    { kind: 'pair', k: 'plan',        v: 'premium' },
    { kind: 'pair', k: 'expires_at',  v: '2027-03-14' },
    { kind: 'pair', k: 'min_version', v: '1.2' },
    { kind: 'pair', k: 'offline_days', v: '5' },
    { kind: 'out',  txt: '' },
    { kind: 'ok',   txt: 'assinatura conferida no próprio PC' },
    { kind: 'warn', txt: 'liberando módulos…' }
  ];
  var MODULOS = ['clientes', 'cadastros', 'ordens', 'relatórios'];

  var corpo = $('#term-body');
  var caixaMods = $('#term-mods');
  var led = $('#term-led');
  var timers = [];

  function limparTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function linha(item) {
    var el = document.createElement('div');
    el.className = 'term__line is-in';
    if (item.kind === 'pair') {
      el.dataset.kind = 'key';
      el.innerHTML = '<span class="term__k">  ' + item.k + '</span><span class="term__v"></span>';
      el.lastChild.textContent = item.v;
    } else {
      el.dataset.kind = item.kind;
      el.textContent = item.txt || ' ';
    }
    return el;
  }

  function chips() {
    caixaMods.innerHTML = '';
    return MODULOS.map(function (m) {
      var s = document.createElement('span');
      s.className = 'term__mod';
      s.textContent = m;
      caixaMods.appendChild(s);
      return s;
    });
  }

  function rodar() {
    if (!corpo) return;
    limparTimers();
    corpo.innerHTML = '';
    led.classList.remove('is-done');
    var mods = chips();

    if (calmo) {
      ROTEIRO.forEach(function (i) { corpo.appendChild(linha(i)); });
      mods.forEach(function (m) { m.classList.add('is-on'); });
      led.classList.add('is-done');
      return;
    }

    var t = 0;
    ROTEIRO.forEach(function (item, i) {
      t += (i === 6 ? 520 : item.txt === '' ? 90 : 145);
      timers.push(setTimeout(function () { corpo.appendChild(linha(item)); }, t));
    });
    mods.forEach(function (m, i) {
      timers.push(setTimeout(function () { m.classList.add('is-on'); }, t + 260 + i * 170));
    });
    timers.push(setTimeout(function () { led.classList.add('is-done'); }, t + 260 + MODULOS.length * 170));
  }

  var replay = $('#term-replay');
  if (replay) replay.addEventListener('click', rodar);
  rodar();

  /* ── 2. índice: filtros + linha clicável ─────────────────────────────── */
  var linhas = $$('#tbl tbody tr');

  $$('.filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var alvo = btn.dataset.filter;
      $$('.filter').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      linhas.forEach(function (tr) {
        tr.classList.toggle('is-hidden', alvo !== 'all' && tr.dataset.cat !== alvo);
      });
    });
  });

  linhas.forEach(function (tr) {
    // no celular as colunas de chave e estado somem — a informação volta aqui
    var cels = tr.children;
    var meta = document.createElement('div');
    meta.className = 't-meta';
    var k = document.createElement('span');
    k.className = 't-key';
    k.textContent = cels[0].textContent;
    meta.appendChild(k);
    var sel = cels[3].querySelector('.badge');
    if (sel) meta.appendChild(sel.cloneNode(true));
    cels[1].appendChild(meta);

    tr.tabIndex = 0;
    tr.setAttribute('role', 'link');
    var ir = function () {
      var el = document.getElementById(tr.dataset.go);
      if (el) el.scrollIntoView({ behavior: calmo ? 'auto' : 'smooth', block: 'start' });
    };
    tr.addEventListener('click', ir);
    tr.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ir(); }
    });
  });

  /* ── 3. espinha dorsal ───────────────────────────────────────────────── */
  var DETALHE = {
    app: {
      t: 'O que roda no PC do cliente',
      h: 'Um servidor Flask sobe em <code>127.0.0.1</code> e o app abre uma janela dedicada do Edge apontando para ele — parece um programa, é uma aplicação web. O banco SQLite fica em <code>%APPDATA%</code>, fora da pasta de instalação: reinstalar ou atualizar não encosta nos dados. O empacotamento é Nuitka + MinGW, e o instalador sai do Inno Setup. Cada módulo é um arquivo Python registrado com import estático — se o import for dinâmico, o módulo simplesmente não entra no executável.'
    },
    srv: {
      t: 'O que decide se o programa abre',
      h: 'O app manda chave, identificação da máquina, produto e versão. O servidor responde com um payload <b>assinado em Ed25519</b> que o app reverifica sozinho, sem confiar na rede. Dentro vem o plano, a data de corte, os módulos liberados, quantos dias ele pode rodar offline e qual a versão mínima daquele produto. É o mesmo servidor para todos os sistemas, mas cada produto só enxerga os próprios dados.'
    },
    sync: {
      t: 'O que só alguns produtos precisam',
      h: 'A arena precisava que a equipe usasse pelo celular com o PC desligado; a oficina não precisa. Então o espelho na nuvem é opcional, e só do módulo que faz sentido. O endereço de cada cliente vem de um <code>token</code> derivado da própria chave de licença, e cada um vive num schema Postgres separado. A junção é registro a registro, mais recente vence — nunca o banco inteiro de um lado por cima do outro.'
    }
  };

  var painel = $('#spine-detail');
  function mostrarNo(chave) {
    var d = DETALHE[chave];
    if (!d || !painel) return;
    painel.innerHTML = '<h4>' + d.t + '</h4><p>' + d.h + '</p>';
  }
  $$('#spine .node').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('#spine .node').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      mostrarNo(b.dataset.node);
    });
  });
  mostrarNo('app');

  /* ── 4. visores de tela ──────────────────────────────────────────────── */
  var GALERIAS = {
    garage: [
      ['garage-hub', 'Hub', 'Hub — o cliente escolhe o módulo'],
      ['garage-ordens', 'Ordens', 'Ordens de serviço · filtro por status e período'],
      ['garage-os-detalhe', 'OS aberta', 'OS aberta · peças com custo, margem e lucro'],
      ['garage-clientes', 'Clientes', 'Clientes e seus veículos'],
      ['garage-cadastros', 'Catálogo', 'Catálogo de serviços e peças'],
      ['garage-relatorios', 'Faturamento', 'Relatórios · faturamento'],
      ['garage-relatorios-producao', 'Produção', 'Relatórios · produção'],
      ['garage-orcamento-pdf', 'Orçamento', 'Orçamento do cliente, pronto para imprimir', 1],
      ['garage-config', 'Configurações', 'Configurações e usuários'],
      ['garage-login', 'Entrada', 'Tela de entrada']
    ],
    arena: [
      ['arena-hub', 'Hub', 'Hub da arena — o dono escolhe o módulo'],
      ['arena-aulas', 'Aulas', 'Alunos, plano parcela a parcela e saldo de reposição'],
      ['arena-comandas', 'Comandas', 'Comandas em aberto e pagas, com o caixa do dia'],
      ['arena-comanda-leitor', 'Leitor', 'Comanda aberta: passa o leitor de código de barras e o item entra sozinho'],
      ['arena-cupom', 'Cupom', 'Cupom de 44 mm para térmica, com a logo da arena', 1],
      ['arena-estoque', 'Estoque', 'Estoque do bar e da loja, com código de barras por produto'],
      ['arena-ranking', 'Ranking', 'Ranking dos jogadores por categoria'],
      ['arena-relatorios', 'Relatórios', 'Relatórios da arena'],
      ['arena-config', 'Configurações', 'Configurações, usuários e nuvem'],
      ['arena-login', 'Entrada', 'Tela de entrada']
    ],
    admin: [
      ['admin-painel', 'Visão geral', 'Visão do estúdio · todos os produtos'],
      ['admin-licencas', 'Licenças', 'Licenças de um produto'],
      ['admin-precos', 'Preços', 'Preços e termos por produto'],
      ['admin-atualizacao', 'Atualização', 'Versão mínima e link do instalador'],
      ['admin-painel-full', 'Painel inteiro', 'O painel do estúdio de ponta a ponta', 1],
      ['admin-login', 'Entrada', 'Entrada do painel']
    ],
    sync: [
      ['sync-aulas-mobile', 'Aulas na nuvem', 'Aulas na nuvem, no celular da recepção'],
      ['sync-login-mobile', 'Acesso', 'Acesso pelo link da arena']
    ],
    erp: [
      ['erp-painel', 'Painel', 'Painel do mês — resultado, OS abertas e reajustes a decidir'],
      ['erp-clientes', 'Clientes', 'Cadastro com documento validado, contrato e OS por cliente'],
      ['erp-contratos', 'Contratos', 'Contratos e o aviso de reajuste esperando decisão'],
      ['erp-os', 'Ordens', 'Ordem de serviço com técnico, situação e valor'],
      ['erp-caixa', 'Fluxo de caixa', 'Previsto × realizado, dia a dia'],
      ['erp-estoque', 'Estoque', 'Saldo, mínimo e custo médio por peça'],
      ['erp-relatorios', 'Relatórios', 'Resultado do mês por categoria — um dos seis relatórios', 1]
    ],
    monit: [
      ['monit-dashboard', 'Painel central', 'Painel central · centrais, agenda e sinal'],
      ['monit-popup', 'Atendimento', 'Atendimento do alarme · WhatsApp já escrito'],
      ['monit-eventos', 'Eventos', 'Histórico de eventos'],
      ['monit-dash2', 'Canal WhatsApp', 'Painel com o canal de WhatsApp'],
      ['monit-login', 'Entrada', 'Acesso restrito à central']
    ],
    porter: [
      ['pgporter-console', 'Console', 'Console do operador · câmeras e acionamento'],
      ['pgporter-full', 'Console inteiro', 'Console inteiro, com o simulador de equipamentos', 1]
    ],
    sitepg: [
      ['site-pg', 'Home', 'Home do site'],
      ['site-pg-full', 'Página inteira', 'A home de ponta a ponta', 1],
      ['site-pg-mobile', 'Celular', 'A mesma home no celular']
    ],
    siteamp: [
      ['siteamp-desktop', 'Home', 'Home em React'],
      ['siteamp-desktop-full', 'Página inteira', 'A home de ponta a ponta', 1],
      ['siteamp-mobile', 'Celular', 'A mesma home no celular']
    ],
  };

  var atual = { lista: [], i: 0 };

  function montarVisor(caixa) {
    var lista = GALERIAS[caixa.dataset.shots];
    if (!lista) return;

    var palco = document.createElement('div');
    palco.className = 'shots__stage';
    var img = document.createElement('img');
    img.alt = lista[0][2];
    img.loading = 'lazy';
    img.decoding = 'async';
    var cap = document.createElement('p');
    cap.className = 'shots__cap';
    palco.appendChild(img);
    palco.appendChild(cap);

    var tabs = document.createElement('div');
    tabs.className = 'shots__tabs';
    tabs.setAttribute('role', 'tablist');

    function trocar(i) {
      var item = lista[i];
      img.src = 'assets/shots/' + item[0] + '.webp';
      img.alt = item[2];
      img.classList.toggle('is-tall', !!item[3]);
      cap.textContent = item[2];
      $$('button', tabs).forEach(function (b, j) {
        b.setAttribute('aria-selected', String(j === i));
      });
      caixa._i = i;
    }

    lista.forEach(function (item, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'shots__tab';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(i === 0));
      b.textContent = item[1];
      b.addEventListener('click', function () { trocar(i); });
      tabs.appendChild(b);
    });

    img.addEventListener('click', function () { abrirLb(lista, caixa._i || 0); });
    img.style.cursor = 'zoom-in';

    caixa.appendChild(palco);
    caixa.appendChild(tabs);
    trocar(0);
  }

  $$('[data-shots]').forEach(montarVisor);

  /* ── 5. lightbox ─────────────────────────────────────────────────────── */
  var lb = $('#lb'), lbImg = $('#lb-img'), lbCap = $('#lb-cap');

  function pintarLb() {
    var item = atual.lista[atual.i];
    lbImg.src = 'assets/shots/' + item[0] + '.webp';
    lbImg.alt = item[2];
    lbCap.textContent = item[2] + '  ·  ' + (atual.i + 1) + '/' + atual.lista.length;
  }
  function abrirLb(lista, i) {
    atual.lista = lista;
    atual.i = i;
    pintarLb();
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    $('#lb-x').focus();
  }
  function fecharLb() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function passar(d) {
    atual.i = (atual.i + d + atual.lista.length) % atual.lista.length;
    pintarLb();
  }

  $('#lb-x').addEventListener('click', fecharLb);
  $('#lb-prev').addEventListener('click', function () { passar(-1); });
  $('#lb-next').addEventListener('click', function () { passar(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) fecharLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') fecharLb();
    if (e.key === 'ArrowLeft') passar(-1);
    if (e.key === 'ArrowRight') passar(1);
  });

  /* ── 6. reveal ao rolar ──────────────────────────────────────────────── */
  var alvos = $$('.sec__head, .case__top, .points, .shots, .stack-grid, .nocap, .spine');
  alvos.forEach(function (el) { el.classList.add('rv'); });

  if ('IntersectionObserver' in window && !calmo) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 });
    alvos.forEach(function (el) { io.observe(el); });
  } else {
    alvos.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ── 7. a nav acompanha a faixa clara ────────────────────────────────── */
  var nav = $('#nav');
  var claro = $('#web');
  if (nav && claro && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (ent) {
      ent.forEach(function (e) {
        nav.classList.toggle('is-light', e.isIntersecting && e.intersectionRatio > 0);
      });
    }, { rootMargin: '-62px 0px -85% 0px' });
    io2.observe(claro);
  }
})();
