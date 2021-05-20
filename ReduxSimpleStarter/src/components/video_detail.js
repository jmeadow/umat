import React from 'react';

const VideoDetail = ({video}) => { // pull video from prop
    if (!video) {
        return <div>Loading...</div>; // return statement means nothing else will be run
    }

    const videoId = video.id.videoId;
    const url = `https://wwww.youtube.com/embed/${videoId}`;
    return (
        <div className="video-detail col-md-8">
            <div className="embed-responosive embed-responsive-16by9">
                <iframe className="embed-responsive-item" src={url}></iframe>
            </div>
            <div className="details"> 
                <div>{video.snippet.title}</div>
                <div>{video.snippet.description}</div>
            </div>
        </div>
    );
};

export default VideoDetail;