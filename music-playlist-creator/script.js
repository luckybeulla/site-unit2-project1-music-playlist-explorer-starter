document.addEventListener("DOMContentLoaded", function() {
    const playlistContainer = document.querySelector('.playlist-cards');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalButton = document.getElementById('closeModal');
    const playlistImage = document.getElementById('playlistImage');
    const playlistTitle = document.getElementById('playlistTitle');
    const playlistCreator = document.getElementById('playlistCreator');
    const playlistLikes = document.getElementById('playlistLikes');
    const songList = document.getElementById('songList');
    const shuffleButton = document.getElementById('shuffleButton');

    const featuredPlaylistImage = document.getElementById('featuredPlaylistImage');
    const featuredPlaylistName = document.getElementById('featuredPlaylistName');
    const featuredSongList = document.getElementById('featuredSongList');

    function createPlaylistCard(playlist) {
        const card = document.createElement('div');
        card.classList.add('playlist-card');

        card.innerHTML = `
            <img src="${playlist.playlist_art}" alt="Playlist Cover">
            <h2 class="playlist-name">${playlist.playlist_name}</h2>
            <p class="playlist-creator">Created by ${playlist.playlist_creator}</p>
            <p><span class="like-icon" data-liked="false" data-likes="${playlist.likeCount}"><span class="heart">❤️</span>&nbsp;<span class="like-count">${playlist.likeCount}</span></span></p>
        `;

        card.addEventListener('click', () => openModal(playlist));

        const likeIcon = card.querySelector('.like-icon');
        likeIcon.addEventListener('click', (event) => {
            event.stopPropagation(); 
            toggleLike(event, playlist);
        });

        return card;
    }

    function loadPlaylists() {
        if (playlistContainer) {
            playlistContainer.innerHTML = ''; 
            data.playlists.forEach(playlist => {
                const card = createPlaylistCard(playlist);
                playlistContainer.appendChild(card);
            });
        }
    }

    function openModal(playlist) {
        playlistImage.src = playlist.playlist_art;
        playlistTitle.textContent = playlist.playlist_name;
        playlistCreator.textContent = `Created by: ${playlist.playlist_creator}`;
        playlistLikes.textContent = `Likes: ${playlist.likeCount}`;
        
        songList.innerHTML = ''; 
        playlist.songs.forEach(song => {
            const songItem = document.createElement('li');
            songItem.classList.add('song-item');
            songItem.innerHTML = `
                <div class="song-details">
                    <img src="${song.cover_art}" alt="${song.title}">
                    <p class="song-title">${song.title}</p>
                    <p>Artist: ${song.artist}</p>
                    <p>Album: ${song.album}</p>
                </div>
                <span class="song-duration">${song.duration}</span>
            `;
            songList.appendChild(songItem);
        });

        modalOverlay.style.display = 'flex';

        shuffleButton.addEventListener('click', () => shuffleSongs(playlist));
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            modalOverlay.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            modalOverlay.style.display = 'none';
        }
    });

    loadPlaylists();

    function toggleLike(event, playlist) {
        const button = event.target.closest('.like-icon');
        const liked = button.getAttribute('data-liked') === 'true';
        let likes = parseInt(button.getAttribute('data-likes'), 10);

        if (isNaN(likes)) {
            likes = 0; 
        }

        if (liked) {
            likes -= 1;
            button.querySelector('.like-count').textContent = likes;
            button.setAttribute('data-liked', 'false');
            button.classList.remove('liked');
        } else {
            likes += 1;
            button.querySelector('.like-count').textContent = likes;
            button.setAttribute('data-liked', 'true');
            button.classList.add('liked');
        }

        button.setAttribute('data-likes', likes);

        playlist.likeCount = likes;
    }

    function shuffleSongs(playlist) {
        for (let i = playlist.songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [playlist.songs[i], playlist.songs[j]] = [playlist.songs[j], playlist.songs[i]];
        }

        songList.innerHTML = '';
        playlist.songs.forEach(song => {
            const songItem = document.createElement('li');
            songItem.classList.add('song-item');
            songItem.innerHTML = `
                <div class="song-details">
                    <img src="${song.cover_art}" alt="${song.title}">
                    <p class="song-title">${song.title}</p>
                    <p>Artist: ${song.artist}</p>
                    <p>Album: ${song.album}</p>
                </div>
                <span class="song-duration">${song.duration}</span>
            `;
            songList.appendChild(songItem);
        });
    }

    function displayRandomPlaylist() {
        const randomIndex = Math.floor(Math.random() * data.playlists.length);
        const randomPlaylist = data.playlists[randomIndex];

        if (featuredPlaylistImage && featuredPlaylistName && featuredSongList) {
            featuredPlaylistImage.src = randomPlaylist.playlist_art;
            featuredPlaylistName.textContent = randomPlaylist.playlist_name;
            
            featuredSongList.innerHTML = ''; 
            randomPlaylist.songs.forEach(song => {
                const songItem = document.createElement('li');
                songItem.classList.add('song-item');
                songItem.innerHTML = `
                    <div class="song-details">
                        <img src="${song.cover_art}" alt="${song.title}">
                        <p class="song-title">${song.title}</p>
                        <p>Artist: ${song.artist}</p>
                        <p>Album: ${song.album}</p>
                    </div>
                    <span class="song-duration">${song.duration}</span>
                `;
                featuredSongList.appendChild(songItem);
            });
        }
    }

    if (document.querySelector('.featured-page')) {
        displayRandomPlaylist();
    }

    const addPlaylistButton = document.getElementById('addPlaylistButton');
    const addPlaylistModal = document.getElementById('addPlaylistModal');
    const addPlaylistForm = document.getElementById('addPlaylistForm');
    const playlistCards = document.getElementById('playingCards');

    addPlaylistButton.addEventListener('click', function () {
        addPlaylistModal.style.display = 'flex';
    });

    closeModalButton.addEventListener('click', function () {
        addPlaylistModal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target == addPlaylistModal) {
            addPlaylistModal.style.display = 'none';
        }
    });

    addPlaylistForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const imageUrl = document.getElementById('newPlaylistImage').value;
        const name = document.getElementById('newPlaylistName').value;
        const description = document.getElementById('newPlaylistDescription').value;

        const newPlaylist = {
            playlist_art: imageUrl,
            playlist_name: name,
            playlist_creator: 'You',
            likeCount: 0,
            songs: []
        };

        const newCard = createPlaylistCard(newPlaylist);

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = description;
        newCard.appendChild(descriptionElement);

        playlistCards.insertBefore(newCard, playlistCards.firstChild);

        addPlaylistForm.reset();
        addPlaylistModal.style.display = 'none';
    });

    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', function(event) {
        const query = event.target.value.trim().toLowerCase();

        const allPlaylistCards = document.querySelectorAll('.playlist-card');

        allPlaylistCards.forEach(card => {
            const name = card.querySelector('.playlist-name').textContent.toLowerCase();
            const creator = card.querySelector('.playlist-creator').textContent.toLowerCase();

            if (name.includes(query) || creator.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});
