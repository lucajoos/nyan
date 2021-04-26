const ImageList = props => {
    const images = props.images.map(({id, urls}) => {
        return <img width={'250px'} key={id} src={urls.small} alt={''}/>;
    });

    return <div className={'grid gap-4 grid-cols-list'}>{images}</div>;
};

export default ImageList;