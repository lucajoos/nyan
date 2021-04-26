import Image from './Image';

const ImageList = props => {
    const images = props.images?.map(path => {
        if(path) {
            return <Image path={path} key={path.toString()} />
        }
    });

    return <div className={'my-22 grid gap-4 grid-cols-list justify-items-center items-center'}>{images}</div>;
};

ImageList.defaultProps = {
    images: []
}

export default ImageList;