const clientId = "596eeff228574af894df4dff220cd964";
const redirectUri = "http://localhost:3000/";   //Have to add this on spotify redirect uri's on the spotify api.
let accessToken ="";

const Spotify={
    getAccessToken(term){
        if(accessToken){
            return accessToken;
        }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if(accessTokenMatch && expiresInMatch ){
        accessToken = accessTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1]);
        const d = new Date();
        d.setTime(d.getTime() + (expiresIn*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = "access_token=" + accessTokenMatch[1] + ";" + expires + ";path=/";
        window.setTimeout(()=> (accessToken=""), expiresIn * 1000 );
        window.history.pushState("Access Token", null, "/"); // this clear the parameters and allowing us to get new access token when it expires.
        return accessToken;
    }else{
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        const d2 = new Date();
        d2.setTime(d2.getTime() + (10*1000));
        let expires2 = "expires="+ d2.toUTCString();
        document.cookie = "search_term=" + term + ";" + expires2 + ";path=/";
        window.location =accessUrl;
        // accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        
        alert("now you can search")
    }
},
search(term){
    let token = Spotify.getCookie("access_token")
    console.log("Cookie access_token: ",token)
    if(token=="")
        {console.log("Access token not found")
        accessToken= Spotify.getAccessToken(term);}
    
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers:{
            Authorization: `Bearer ${accessToken || token}`
        }
    
    })
    .then(response => {
        return response.json();
    })
    .then(jsonResponse => {
        if(!jsonResponse.tracks){
            return [];
        }
        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    });
    },

    savePlaylist(name, trackUris){
        if(!name || !trackUris.length){
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}` };
        let userId;

        return fetch("https://api.spotify.com/v1/me", {headers: headers})
        .then( response => response.json())
        .then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
                headers:headers,
                method: "POST",
                body: JSON.stringify({name:name})

            })
            .then(response => response.json())
            .then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(
                     `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks` ,
                    {
                        headers: headers,
                        method : "POST",
                        body: JSON.stringify({uris: trackUris})
                    }
                );

            });
        });

    },
    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }
}



export default Spotify;