<script>
    document.addEventListener('DOMContentLoaded', function() {
        console.log("Initialisation du script...");
        
        // Inspection des lignes du tableau pour les attributs de probabilité
        console.log("Inspection des lignes du tableau pour les attributs de probabilité:");
        document.querySelectorAll('.bet-row').forEach((row, index) => {
            const dataProb = row.getAttribute('data-probability');
            const probCell = row.querySelector('.probability-column')?.textContent;
            console.log(`Ligne ${index} - Match: ${row.querySelector('.match-column').textContent}, Prob data: ${dataProb}, Affichée: ${probCell}`);
        });

        /* Navigation entre les vues principales */
        const mainTabs = document.querySelectorAll('.main-tab');
        const mainViews = document.querySelectorAll('.main-view');

        mainTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const viewId = this.getAttribute('data-view');

                // Désactiver tous les onglets
                mainTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Cacher toutes les vues
                mainViews.forEach(v => v.classList.remove('active'));

                // Afficher la vue correspondante
                document.getElementById(viewId).classList.add('active');
            });
        });

        /* Gestion des clics sur les lignes du tableau des paris */
        document.querySelectorAll('.bet-row').forEach(row => {
            row.addEventListener('click', function() {
                const league = this.getAttribute('data-league');
                const homeTeam = this.getAttribute('data-home-team');
                const awayTeam = this.getAttribute('data-away-team');

                if (window.showMatchDetails && league && homeTeam && awayTeam) {
                    window.showMatchDetails(league, homeTeam, awayTeam);
                }
            });
        });

        /* Navigation des ligues */
        const leagueTabs = document.querySelectorAll('.league-flag-tab');
        const leagueSections = document.querySelectorAll('.league-section');

        leagueTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const leagueIndex = this.getAttribute('data-league');

                // Désactiver tous les onglets
                leagueTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Cacher toutes les sections
                leagueSections.forEach(section => section.classList.remove('active'));

                // Afficher la section correspondante
                document.querySelector(`.league-section[data-league="${leagueIndex}"]`).classList.add('active');
            });
        });

        /* Gestion des matchs */
        const matchItems = document.querySelectorAll('.match-item');

        /* Cacher tous les contenus de match */
        document.querySelectorAll('.match-content').forEach(content => {
            content.style.display = 'none';
        });

        /* Sélectionner par défaut le premier match de chaque ligue */
        leagueSections.forEach(section => {
            const firstMatch = section.querySelector('.match-item');
            if (firstMatch) {
                firstMatch.classList.add('active');
                const matchId = firstMatch.getAttribute('data-match');
                const firstContent = document.getElementById('tab-' + matchId);
                if (firstContent) {
                    firstContent.style.display = 'block';
                }
            }
        });

        /* Ajouter des écouteurs d'événements sur chaque carte de match */
        matchItems.forEach(item => {
            item.addEventListener('click', function() {
                /* Récupérer l'identifiant du match */
                const matchId = this.getAttribute('data-match');
                const leagueSection = this.closest('.league-section');

                /* Désactiver tous les matchs dans cette section de ligue */
                leagueSection.querySelectorAll('.match-item').forEach(i => i.classList.remove('active'));
                leagueSection.querySelectorAll('.match-content').forEach(c => c.style.display = 'none');

                /* Activer le match sélectionné */
                this.classList.add('active');
                const matchContent = document.getElementById('tab-' + matchId);
                if (matchContent) {
                    matchContent.style.display = 'block';
                    matchContent.scrollIntoView({ behavior: 'smooth', block: 'start' });

                    /* Animation simple */
                    matchContent.style.opacity = '0';
                    matchContent.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        matchContent.style.opacity = '1';
                        matchContent.style.transform = 'translateY(0)';
                        matchContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    }, 10);
                }
            });
        });

        /* Sous-onglets dans chaque match */
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                const tabContent = this.closest('.match-content').querySelector('#' + tabName);

                /* Désactiver tous les boutons et contenus dans ce groupe */
                const tabGroup = this.closest('.match-content');
                tabGroup.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                tabGroup.querySelectorAll('.tab-content').forEach(c => {
                    c.classList.remove('active');
                    c.style.display = 'none';
                });

                /* Activer le bouton et le contenu correspondant */
                this.classList.add('active');
                tabContent.classList.add('active');
                tabContent.style.display = 'block';

                /* Animation simple */
                tabContent.style.opacity = '0';
                setTimeout(() => {
                    tabContent.style.opacity = '1';
                    tabContent.style.transition = 'opacity 0.3s ease';
                }, 10);
            });
        });

        /* Fonction pour afficher les détails d'un match */
        window.showMatchDetails = function(league, homeTeam, awayTeam) {
            console.log(`Recherche du match: ${league} - ${homeTeam} vs ${awayTeam}`);

            // Activer l'onglet principal des ligues
            document.querySelector('.main-tab[data-view="leagues-view"]').click();

            // Trouver l'onglet de la ligue correspondante
            const leagueTabs = document.querySelectorAll('.league-flag-tab');
            let foundTab = false;

            // 1. D'abord, essayer une correspondance exacte (insensible à la casse)
            leagueTabs.forEach((tab, index) => {
                const leagueName = tab.querySelector('.league-name').textContent.toLowerCase();
                const searchLeague = league.toLowerCase();

                // Pour le débogage
                console.log(`Comparaison: "${leagueName}" avec "${searchLeague}"`);

                // Correspondance exacte ou correspondance avec '2' (pour les secondes divisions)
                if (leagueName === searchLeague ||
                    (searchLeague.endsWith('2') && leagueName === searchLeague.replace('2', ' 2')) ||
                    (leagueName.endsWith('2') && searchLeague === leagueName.replace(' 2', '2'))) {
                    tab.click();
                    foundTab = true;
                    console.log(`Trouvé! Activation de l'onglet ${index}`);

                    // Trouver et activer le match correspondant
                    setTimeout(() => {
                        findAndClickMatch(homeTeam, awayTeam);
                    }, 300);
                    return;
                }
            });

            // 2. Si aucune correspondance exacte, essayer une correspondance partielle
            if (!foundTab) {
                console.log("Recherche par correspondance partielle...");
                leagueTabs.forEach((tab, index) => {
                    const leagueName = tab.querySelector('.league-name').textContent.toLowerCase();
                    const searchLeague = league.toLowerCase();

                    // Essayer plusieurs variations de noms de ligue
                    if (leagueName.includes(searchLeague) ||
                        searchLeague.includes(leagueName) ||
                        (leagueName.replace(' ', '').includes(searchLeague)) ||
                        (searchLeague.replace(' ', '').includes(leagueName))) {
                        tab.click();
                        foundTab = true;
                        console.log(`Match partiel trouvé! Activation de l'onglet ${index}`);

                        // Trouver et activer le match correspondant
                        setTimeout(() => {
                            findAndClickMatch(homeTeam, awayTeam);
                        }, 300);
                        return;
                    }
                });
            }

            // Si aucune correspondance n'a été trouvée
            if (!foundTab) {
                console.error(`Aucune ligue trouvée correspondant à "${league}"`);
                alert(`Désolé, nous n'avons pas pu trouver le match ${homeTeam} vs ${awayTeam} dans la ligue ${league}.`);
            }

            // Fonction interne pour trouver et cliquer sur un match
            function findAndClickMatch(homeTeam, awayTeam) {
                const matchItems = document.querySelectorAll('.match-item');
                let matchFound = false;

                matchItems.forEach(item => {
                    const matchText = item.querySelector('.match-item-teams').textContent;

                    // Normaliser les textes pour la comparaison
                    const normalizedMatchText = matchText.toLowerCase().trim();
                    const normalizedHomeTeam = homeTeam.toLowerCase().trim();
                    const normalizedAwayTeam = awayTeam.toLowerCase().trim();

                    console.log(`Vérification match: "${normalizedMatchText}"`);
                    console.log(`Recherche: "${normalizedHomeTeam}" vs "${normalizedAwayTeam}"`);

                    // Vérifier si les deux équipes sont présentes dans le texte du match
                    if (normalizedMatchText.includes(normalizedHomeTeam) &&
                        normalizedMatchText.includes(normalizedAwayTeam)) {
                        console.log("Match trouvé! Activation...");
                        item.click();
                        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        matchFound = true;
                        return;
                    }
                });

                if (!matchFound) {
                    console.error(`Match non trouvé: ${homeTeam} vs ${awayTeam}`);
                }
            }
        };

        /* Gestion des accordéons par date */
        const dateHeaders = document.querySelectorAll('.date-header');
        dateHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const dateIndex = this.getAttribute('data-date');
                const dateMatches = document.getElementById(`date-matches-${dateIndex}`);

                // Toggle active class
                dateMatches.classList.toggle('active');

                // Rotate chevron icon
                const chevron = this.querySelector('.fa-chevron-down');
                if (chevron) {
                    chevron.style.transform = dateMatches.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
                }
            });
        });

        // FONCTIONS POUR LE FILTRAGE PAR LIGUE

        // NOUVEAU: Fonction pour mettre à jour l'état du bouton "Toutes"
        function updateSelectAllButton() {
            const allLeagues = document.querySelectorAll('.league-badge');
            const activeLeagues = document.querySelectorAll('.league-badge.active');

            const selectAllBtn = document.getElementById('select-all-leagues');
            const deselectAllBtn = document.getElementById('deselect-all-leagues');

            if (!selectAllBtn || !deselectAllBtn) {
                console.error("Boutons de sélection non trouvés");
                return;
            }

            if (activeLeagues.length === allLeagues.length) {
                selectAllBtn.classList.add('active');
                deselectAllBtn.classList.remove('active');
            } else if (activeLeagues.length === 0) {
                selectAllBtn.classList.remove('active');
                deselectAllBtn.classList.add('active');
            } else {
                selectAllBtn.classList.remove('active');
                deselectAllBtn.classList.remove('active');
            }
        }

        // Fonction pour gérer les filtres de ligue
        function applyLeagueFilters() {
            const activeLeagues = Array.from(document.querySelectorAll('.league-badge.active'))
                .map(badge => badge.getAttribute('data-league'));

            console.log("Ligues actives:", activeLeagues);

            document.querySelectorAll('.bet-row').forEach(row => {
                const leagueCell = row.querySelector('.league-column');
                if (!leagueCell) return;

                const league = leagueCell.textContent.trim();
                const visibleByLeague = activeLeagues.includes(league);

                row.style.display = visibleByLeague ? '' : 'none';
            });

            updateDateCards();
        }

        function updateDateCards() {
            // Pour chaque carte de date, vérifier si elle contient des lignes visibles
            document.querySelectorAll('.date-card').forEach(card => {
                const visibleRows = card.querySelectorAll('.bet-row:not([style*="display: none"])').length;

                // Mettre à jour le compteur de matchs
                const matchCounter = card.querySelector('.match-count');
                if (matchCounter) {
                    matchCounter.textContent = `${visibleRows} matchs`;
                }

                // Masquer la carte si elle ne contient aucun match visible
                card.style.display = visibleRows > 0 ? '' : 'none';
            });
        }

        // Fonctionnalité de filtrage par ligue
        function getAvailableLeagues() {
            const leagueSet = new Set();
            document.querySelectorAll('.bet-row').forEach(row => {
                const leagueCell = row.querySelector('.league-column');
                if (leagueCell) {
                    const league = leagueCell.textContent.trim();
                    if (league) {
                        leagueSet.add(league);
                    }
                }
            });
            console.log("Ligues disponibles:", Array.from(leagueSet));
            return Array.from(leagueSet).sort();
        }

        function createLeagueBadges() {
            console.log("Création des badges de ligue...");
            const leagueEmojis = {
                "ENGLAND": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
                "ENGLAND2": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
                "FRANCE": "🇫🇷",
                "FRANCE2": "🇫🇷",
                "GERMANY": "🇩🇪",
                "GERMANY2": "🇩🇪",
                "ITALY": "🇮🇹",
                "ITALY2": "🇮🇹",
                "SPAIN": "🇪🇸",
                "SPAIN2": "🇪🇸",
                "NETHERLANDS": "🇳🇱",
                "PORTUGAL": "🇵🇹",
                "PORTUGAL2": "🇵🇹",
                "BELGIUM": "🇧🇪",
                "FAROEISLANDS": "🇫🇴",
                "GEORGIA": "🇬🇪",
                "LATVIA": "🇱🇻",
                "ESTONIA": "🇪🇪",
                "CHINA": "🇨🇳",
                "USA": "🇺🇸",
                "LITHUANIA": "🇱🇹",
                "SOUTHKOREA": "🇰🇷",
                "CHILE": "🇨🇱",
                "IRELAND": "🇮🇪",
                "ECUADOR": "🇪🇨",
                "ARGENTINA": "🇦🇷",
                "PARAGUAY": "🇵🇾",
                "COLOMBIA": "🇨🇴",
                "LUXEMBOURG": "🇱🇺",
                "CROATIA": "🇭🇷",
                "HUNGARY": "🇭🇺",
                "POLAND": "🇵🇱",
                "TURKEY": "🇹🇷",
                "BULGARIA": "🇧🇬",
                "SWITZERLAND": "🇨🇭",
                "CZECHREPUBLIC": "🇨🇿",
                "SCOTLAND": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
                "SERBIA": "🇷🇸",
                "NORTHERNIRELAND": "🇬🇧",
                "DENMARK": "🇩🇰",
                "AUSTRIA": "🇦🇹"
            };

            const leagues = getAvailableLeagues();
            const badgesContainer = document.getElementById('leagues-badges-container');

            if (!badgesContainer) {
                console.error("Conteneur de badges non trouvé!");
                return;
            }

            badgesContainer.innerHTML = '';

            leagues.forEach(league => {
                // Compter le nombre de matchs pour cette ligue
                let matchCount = 0;
                document.querySelectorAll('.bet-row').forEach(row => {
                    const leagueCell = row.querySelector('.league-column');
                    if (leagueCell && leagueCell.textContent.trim() === league) {
                        matchCount++;
                    }
                });

                const badge = document.createElement('div');
                badge.className = 'league-badge active';
                badge.setAttribute('data-league', league);

                // Déterminer l'emoji basé sur la ligue
                let emoji = '🏆'; // Emoji par défaut
                if (leagueEmojis[league]) {
                    emoji = leagueEmojis[league];
                }

                // Ajouter l'emoji du drapeau
                const emojiSpan = document.createElement('span');
                emojiSpan.className = 'league-emoji';
                emojiSpan.textContent = emoji;
                badge.appendChild(emojiSpan);

                // Ajouter le nom de la ligue
                const nameSpan = document.createElement('span');
                nameSpan.className = 'league-name';
                nameSpan.textContent = league;
                badge.appendChild(nameSpan);

                // Ajouter le nombre de matchs
                const countSpan = document.createElement('span');
                countSpan.className = 'league-match-count';
                countSpan.textContent = matchCount;
                badge.appendChild(countSpan);

                // Ajouter l'événement de clic
                badge.addEventListener('click', toggleLeague);

                badgesContainer.appendChild(badge);
            });

            updateSelectAllButton();
        }

        function toggleLeague() {
            this.classList.toggle('active');
            applyLeagueFilters();
            updateSelectAllButton();
        }

        // Configuration des boutons de sélection
        const selectAllBtn = document.getElementById('select-all-leagues');
        const deselectAllBtn = document.getElementById('deselect-all-leagues');
        const highProbBtn = document.getElementById('high-probability-matches');

        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', function() {
                document.querySelectorAll('.league-badge').forEach(badge => {
                    badge.classList.add('active');
                });
                applyLeagueFilters();
                updateSelectAllButton();
                
                // Désactiver les autres boutons
                deselectAllBtn.classList.remove('active');
                highProbBtn?.classList.remove('active');

                // Activer ce bouton
                this.classList.add('active');
            });
        } else {
            console.error("Bouton 'Toutes' non trouvé");
        }

        if (deselectAllBtn) {
            deselectAllBtn.addEventListener('click', function() {
                document.querySelectorAll('.league-badge').forEach(badge => {
                    badge.classList.remove('active');
                });
                applyLeagueFilters();
                updateSelectAllButton();
                
                // Désactiver les autres boutons
                selectAllBtn.classList.remove('active');
                highProbBtn?.classList.remove('active');

                // Activer ce bouton
                this.classList.add('active');
            });
        } else {
            console.error("Bouton 'Aucune' non trouvé");
        }

        // NOUVEAU GESTIONNAIRE pour le bouton Opportunités
        if (highProbBtn) {
            highProbBtn.addEventListener('click', function() {
                // Désactiver les autres boutons
                selectAllBtn.classList.remove('active');
                deselectAllBtn.classList.remove('active');

                // Activer ce bouton
                this.classList.add('active');

                // Activer toutes les ligues d'abord
                document.querySelectorAll('.league-badge').forEach(badge => {
                    badge.classList.add('active');
                });

                // Récupérer le seuil depuis l'attribut data
                const probabilityThreshold = parseInt(this.getAttribute('data-threshold')) || 70;
                console.log("Filtrage par probabilité avec seuil:", probabilityThreshold);

                // Filtrer les lignes selon la probabilité
                document.querySelectorAll('.bet-row').forEach(row => {
                    try {
                        // Initialiser la probabilité à 0 par défaut
                        let probability = 0;

                        // Vérifier différentes méthodes d'extraction de la probabilité
                        console.log("Traitement de la ligne:", row);

                        // Méthode 1: data-probability explicite
                        if (row.hasAttribute('data-probability')) {
                            probability = parseInt(row.getAttribute('data-probability'));
                            console.log("Probabilité via data-probability:", probability);
                        }
                        // Méthode 2: data-victory-probability pour les paris basés sur l'indice de domination
                        else if (row.hasAttribute('data-victory-probability')) {
                            probability = parseInt(row.getAttribute('data-victory-probability'));
                            console.log("Probabilité via data-victory-probability:", probability);
                        }
                        // Méthode 3: Extraire de la colonne de probabilité (fallback)
                        else {
                            const probCell = row.querySelector('.probability-column');
                            if (probCell) {
                                const probText = probCell.textContent || "";
                                console.log("Texte de probabilité:", probText);

                                // Essayer différents formats
                                const rangeMatch = probText.match(/(\d+)[-–](\d+)/);
                                const singleMatch = probText.match(/(\d+)/);

                                if (rangeMatch) {
                                    probability = parseInt(rangeMatch[1]);
                                    console.log("Probabilité extraite (plage):", probability);
                                } else if (singleMatch) {
                                    probability = parseInt(singleMatch[1]);
                                    console.log("Probabilité extraite (simple):", probability);
                                }
                            }
                        }

                        // S'assurer que probability est un nombre
                        probability = isNaN(probability) ? 0 : probability;
                        console.log("Probabilité finale:", probability, "Seuil:", probabilityThreshold);

                        // Afficher ou masquer selon le seuil
                        row.style.display = probability >= probabilityThreshold ? '' : 'none';
                    } catch (error) {
                        console.error("Erreur lors du filtrage:", error);
                        // Par défaut, afficher la ligne en cas d'erreur
                        row.style.display = '';
                    }
                });

                // Mettre à jour les compteurs de matchs par date
                updateDateCards();
            });
        } else {
            console.error("Bouton 'Opportunités' non trouvé");
        }

        // Animation pour les paris spéciaux
        const specialBets = document.querySelectorAll('.special-bet');
        specialBets.forEach((bet, index) => {
            setTimeout(() => {
                bet.style.opacity = '0';
                bet.style.transform = 'translateX(-10px)';

                setTimeout(() => {
                    bet.style.opacity = '1';
                    bet.style.transform = 'translateX(0)';
                    bet.style.transition = 'all 0.5s ease';
                }, 100);
            }, index * 200);
        });

        // Animation progressive des badges d'opportunité
        setTimeout(() => {
            document.querySelectorAll('.opportunity-badge').forEach((badge, index) => {
                setTimeout(() => {
                    badge.style.opacity = '0';
                    badge.style.transform = 'translateY(-10px) scale(0.8)';

                    setTimeout(() => {
                        badge.style.opacity = '1';
                        badge.style.transform = 'translateY(0) scale(1)';
                        badge.style.transition = 'all 0.5s ease';
                    }, 100);
                }, index * 150);
            });
        }, 500);

        // Gestion de la navigation sur mobile - masquer Billets du jour
        function handleMobileNavigation() {
            const isMobile = window.innerWidth <= 768;

            if (isMobile) {
                // Sur mobile, s'assurer que l'onglet Analyse par ligues est activé
                document.querySelector('.main-tab[data-view="leagues-view"]').classList.add('active');

                const dailyTicketsTab = document.querySelector('.main-tab[data-view="daily-tickets-view"]');
                if (dailyTicketsTab) {
                    dailyTicketsTab.classList.remove('active');
                }

                // Afficher la vue Analyse par ligues
                document.getElementById('leagues-view').classList.add('active');

                const dailyTicketsView = document.getElementById('daily-tickets-view');
                if (dailyTicketsView) {
                    dailyTicketsView.classList.remove('active');
                }
            }
        }

        // Exécuter au chargement et au redimensionnement
        handleMobileNavigation();
        window.addEventListener('resize', handleMobileNavigation);

        // IMPORTANT: Exécuter les initialisations principales
        console.log("Initialisation des filtres...");
        console.log("Tentative de création des badges...");
        setTimeout(function() {
            try {
                createLeagueBadges();
                console.log("Badges créés avec succès");
            } catch (error) {
                console.error("Erreur lors de l'initialisation des filtres:", error);
            }
        }, 500);

        // Définir les fonctions globalement
        window.applyLeagueFilters = applyLeagueFilters;
        window.updateDateCards = updateDateCards;
        window.toggleLeague = toggleLeague;
        window.createLeagueBadges = createLeagueBadges;
        window.updateSelectAllButton = updateSelectAllButton;
    });
</script>
