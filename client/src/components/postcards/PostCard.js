import React from 'react'
 
import CardBodyCarousel from '../home/post_card/CardBodyCarousel';
 
 

const PostCard = ({post }) => {
    return (
        <div  > 
                
            <CardBodyCarousel  post={post}  />
            
          
        </div>
    )
}

export default PostCard
