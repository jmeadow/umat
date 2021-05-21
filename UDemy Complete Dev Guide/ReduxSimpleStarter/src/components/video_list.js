import React from 'react';
import VideoListItem from './video_list_item';

const VideoList = (props) => {
    const videoItems = props.videos.map((video) => { // the map iterator will apply this to each video in the array
        return (
            <VideoListItem 
                onVideoSelect={props.onVideoSelect}
                key={video.etag}
                video={video} />
        );
    });

    return ( // the className is imported from bootstrap
        <ul className="col-md-4 list-group"> 
            {videoItems}
        </ul>
    );
};

export default VideoList;