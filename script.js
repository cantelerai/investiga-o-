document.addEventListener('DOMContentLoaded', function() {
    // Dados das conexões entre os suspeitos
    const connections = [
        { from: 'grupo', to: 'pastorLocal', label: 'Relatou o ocorrido', dashed: false },
        { from: 'grupo', to: 'jheny', label: 'Amizade anterior', dashed: false },
        { from: 'jheny', to: 'sede', label: 'Possível contato', dashed: false },
        { from: 'mauricio', to: 'sede', label: 'Informou sobre o show', dashed: false },
        { from: 'rosa', to: 'sede', label: 'Contato frequente', dashed: false },
        { from: 'pastorLocal', to: 'pastorPresidente', label: 'Alega ter informado', dashed: true },
        { from: 'sede', to: 'pastorPresidente', label: 'Canal oficial', dashed: false }
    ];

    // Dados detalhados para o modal
    const cardDetails = {
        grupo: {
            title: "Grupo",
            description: "Estavam no show. Nem todos aparecem no vídeo. O grupo é composto por jovens que frequentam a mesma igreja e foram juntos ao evento.",
            connections: [
                "Relatou o ocorrido ao Pastor Local",
                "Alguns membros são próximos de Jheny",
                "Não todos aparecem nas filmagens do show"
            ]
        },
        jheny: {
            title: "Jheny (filha do pastor)",
            description: "Sabia previamente que vocês iriam ao show. Se afastou recentemente do grupo. Possui acesso a informações internas da igreja através do pai.",
            connections: [
                "Filha do Pastor Local",
                "Sabia dos planos do grupo para o show",
                "Tem contatos na sede da igreja"
            ]
        },
        mauricio: {
            title: "Maurício",
            description: "Líder do grupo. Já teve conflitos com outros membros. Possui uma personalidade forte e tende a confrontar situações diretamente.",
            connections: [
                "Teve conflitos anteriores com Rosa",
                "Pode ter comentado sobre o show na sede",
                "Conhece o pessoal da sede"
            ]
        },
        rosa: {
            title: "Rosa",
            description: "Líder. Sempre busca parecer que está 'tudo sob controle'. Muito preocupada com a imagem do grupo perante a liderança da igreja.",
            connections: [
                "Busca manter controle sobre as situações",
                "Tem contato frequente com a sede",
                "Pode ter relatado o ocorrido para parecer pró-ativa"
            ]
        },
        sede: {
            title: "Pessoal da Sede",
            description: "Possível origem da fofoca. A sede central da igreja tem acesso a informações de todas as congregações e pode ter distorcido os fatos.",
            connections: [
                "Recebe informações de várias fontes",
                "Relata diretamente ao Pastor Presidente",
                "Pode ter interpretado mal a situação"
            ]
        },
        pastorLocal: {
            title: "Pastor Local",
            description: "Já mentiu outras vezes para proteger a imagem da igreja. Disse que 'chegou ao presidente'. Pode estar tentando esconder algo.",
            connections: [
                "Pai de Jheny",
                "Recebeu a informação do grupo",
                "Alega ter informado ao Pastor Presidente"
            ]
        },
        pastorPresidente: {
            title: "Pastor Presidente",
            description: "Não conhece vocês pessoalmente. Há dúvidas se realmente soube disso ou se a informação foi deturpada ao chegar até ele.",
            connections: [
                "Recebe relatórios da sede",
                "Pode não ter sido informado corretamente",
                "Toma decisões com base em informações filtradas"
            ]
        }
    };

    // Elementos do DOM
    const modal = document.getElementById('cardModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalConnections = document.getElementById('modalConnections');
    const noteInput = document.getElementById('noteInput');
    const saveNoteBtn = document.getElementById('saveNote');
    const closeBtn = document.querySelector('.close');
    const toggleLinesBtn = document.getElementById('toggleLines');
    const resetViewBtn = document.getElementById('resetView');
    const addNoteBtn = document.getElementById('addNote');
    const board = document.getElementById('investigationBoard');

    // Estado da aplicação
    let linesVisible = true;
    let notes = JSON.parse(localStorage.getItem('investigationNotes')) || {};
    let draggedCard = null;

    // Inicialização
    function init() {
        drawConnectionLines();
        loadNotes();
        setupEventListeners();
        makeCardsDraggable();
    }

    // Desenhar linhas de conexão
    function drawConnectionLines() {
        // Remover linhas existentes
        document.querySelectorAll('.connection-line').forEach(el => el.remove());
        
        connections.forEach(conn => {
            const fromCard = document.getElementById(conn.from);
            const toCard = document.getElementById(conn.to);
            
            if (!fromCard || !toCard) return;
            
            const fromRect = fromCard.getBoundingClientRect();
            const toRect = toCard.getBoundingClientRect();
            const boardRect = board.getBoundingClientRect();
            
            // Calcular posições relativas ao board
            const fromX = fromRect.left + fromRect.width / 2 - boardRect.left;
            const fromY = fromRect.top + fromRect.height / 2 - boardRect.top;
            const toX = toRect.left + toRect.width / 2 - boardRect.left;
            const toY = toRect.top + toRect.height / 2 - boardRect.top;
            
            // Calcular distância e ângulo
            const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
            const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);
            
            // Criar linha
            const line = document.createElement('div');
            line.className = `connection-line ${conn.dashed ? 'dashed' : ''}`;
            line.style.width = `${distance}px`;
            line.style.left = `${fromX}px`;
            line.style.top = `${fromY}px`;
            line.style.transform = `rotate(${angle}deg)`;
            line.style.opacity = linesVisible ? '1' : '0';
            
            // Adicionar tooltip com label
            line.title = conn.label;
            
            board.appendChild(line);
        });
    }

    // Configurar event listeners
    function setupEventListeners() {
        // Botões de expansão dos cards
        document.querySelectorAll('.card-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const cardId = this.getAttribute('data-target');
                openCardModal(cardId);
            });
        });

        // Cards clicáveis
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', function() {
                const cardId = this.id;
                openCardModal(cardId);
            });
        });

        // Fechar modal
        closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });

        // Salvar anotação
        saveNoteBtn.addEventListener('click', saveNote);

        // Botões de controle
        toggleLinesBtn.addEventListener('click', toggleLines);
        resetViewBtn.addEventListener('click', resetCardPositions);
        addNoteBtn.addEventListener('click', addGeneralNote);

        // Redesenhar linhas ao redimensionar
        window.addEventListener('resize', drawConnectionLines);
    }

    // Abrir modal com detalhes do card
    function openCardModal(cardId) {
        const details = cardDetails[cardId];
        if (!details) return;

        modalTitle.textContent = details.title;
        modalDescription.textContent = details.description;
        
        // Limpar conexões anteriores
        modalConnections.innerHTML = '';
        
        // Adicionar conexões
        details.connections.forEach(conn => {
            const li = document.createElement('li');
            li.textContent = conn;
            modalConnections.appendChild(li);
        });

        // Carregar anotações existentes
        noteInput.value = notes[cardId] || '';
        noteInput.setAttribute('data-card', cardId);

        modal.style.display = 'block';
    }

    // Fechar modal
    function closeModal() {
        modal.style.display = 'none';
        noteInput.removeAttribute('data-card');
    }

    // Salvar anotação
    function saveNote() {
        const cardId = noteInput.getAttribute('data-card');
        if (!cardId) return;

        notes[cardId] = noteInput.value.trim();
        localStorage.setItem('investigationNotes', JSON.stringify(notes));
        
        // Feedback visual
        const originalText = saveNoteBtn.textContent;
        saveNoteBtn.textContent = 'Salvo!';
        saveNoteBtn.style.background = '#2a9d8f';
        
        setTimeout(() => {
            saveNoteBtn.textContent = originalText;
            saveNoteBtn.style.background = '#457b9d';
        }, 1500);
    }

    // Carregar anotações salvas
    function loadNotes() {
        // As anotações são carregadas mas não exibidas visualmente
        // Elas aparecem apenas quando o card é aberto no modal
        console.log('Anotações carregadas:', Object.keys(notes).length);
    }

    // Alternar visibilidade das linhas
    function toggleLines() {
        linesVisible = !linesVisible;
        document.querySelectorAll('.connection-line').forEach(line => {
            line.style.opacity = linesVisible ? '1' : '0';
        });
        
        toggleLinesBtn.innerHTML = linesVisible 
            ? '<i class="fas fa-project-diagram"></i> Esconder Linhas' 
            : '<i class="fas fa-project-diagram"></i> Mostrar Linhas';
    }

    // Resetar posições dos cards
    function resetCardPositions() {
        const cardPositions = {
            grupo: { top: '65%', left: '40%' },
            jheny: { top: '10%', left: '15%' },
            mauricio: { top: '40%', left: '10%' },
            rosa: { top: '40%', left: '30%' },
            sede: { top: '10%', left: '65%' },
            pastorLocal: { top: '65%', left: '15%' },
            pastorPresidente: { top: '65%', left: '65%' }
        };

        Object.keys(cardPositions).forEach(cardId => {
            const card = document.getElementById(cardId);
            if (card) {
                card.style.top = cardPositions[cardId].top;
                card.style.left = cardPositions[cardId].left;
                card.style.transform = 'none';
            }
        });

        drawConnectionLines();
    }

    // Adicionar anotação geral
    function addGeneralNote() {
        const note = prompt('Digite sua anotação geral sobre a investigação:');
        if (note && note.trim()) {
            if (!notes.general) notes.general = [];
            notes.general.push({
                text: note.trim(),
                date: new Date().toLocaleString()
            });
            localStorage.setItem('investigationNotes', JSON.stringify(notes));
            alert('Anotação geral salva!');
        }
    }

    // Tornar cards arrastáveis
    function makeCardsDraggable() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            card.addEventListener('mousedown', startDrag);
            card.addEventListener('touchstart', startDragTouch, { passive: false });
        });

        function startDrag(e) {
            e.preventDefault();
            draggedCard = this;
            
            const shiftX = e.clientX - draggedCard.getBoundingClientRect().left;
            const shiftY = e.clientY - draggedCard.getBoundingClientRect().top;
            
            function moveAt(pageX, pageY) {
                const boardRect = board.getBoundingClientRect();
                
                // Calcular nova posição relativa ao board
                let newX = pageX - shiftX - boardRect.left;
                let newY = pageY - shiftY - boardRect.top;
                
                // Limitar movimento dentro do board
                newX = Math.max(0, Math.min(newX, boardRect.width - draggedCard.offsetWidth));
                newY = Math.max(0, Math.min(newY, boardRect.height - draggedCard.offsetHeight));
                
                draggedCard.style.left = `${newX}px`;
                draggedCard.style.top = `${newY}px`;
            }
            
            function onMouseMove(e) {
                moveAt(e.clientX, e.clientY);
            }
            
            function onTouchMove(e) {
                const touch = e.touches[0];
                moveAt(touch.clientX, touch.clientY);
            }
            
            // Mover o card
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('touchmove', onTouchMove, { passive: false });
            
            // Soltar o card
            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
                drawConnectionLines(); // Redesenhar linhas após mover
            }
            
            function onTouchEnd() {
                onMouseUp();
            }
            
            document.addEventListener('mouseup', onMouseUp, { once: true });
            document.addEventListener('touchend', onTouchEnd, { once: true });
        }
        
        function startDragTouch(e) {
            e.preventDefault();
            startDrag.call(this, e.touches[0]);
        }
    }

    // Inicializar a aplicação
    init();
});