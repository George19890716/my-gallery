import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Ratio from 'react-ratio';
import './gallery.scss';

export default class Gallery extends Component {
  static propTypes = {
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        thumbnail: PropTypes.string.isRequired
      })
    ).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      prevIndex: 0,
      currentIndex: 0,
      translateX: 0,
      zoomIn: false,
      zoomOut: false,
      zoomInUrl: ''
    }

    this.limit = 0;
    this.thumbnails = [...Array(this.props.images.length).keys()].map(i => i = 80 );
    
    this._updateThumbnails = this._updateThumbnails.bind(this);
    this._getLimit = this._getLimit.bind(this);
    this._adjustThumbnail = this._adjustThumbnail.bind(this);
    this._slideToIndex = this._slideToIndex.bind(this);
    this._slideToPrevious = this._slideToPrevious.bind(this);
    this._slideToNext = this._slideToNext.bind(this);
    this._renderArrow = this._renderArrow.bind(this);
    this._renderThumbnailArrow = this._renderThumbnailArrow.bind(this);
    this._renderImage = this._renderImage.bind(this);
    this._renderThumbnail = this._renderThumbnail.bind(this);
    this._renderCanvas = this._renderCanvas.bind(this);
    this._renderThumbnailBar = this._renderThumbnailBar.bind(this);
    this._moveThumbnailBar = this._moveThumbnailBar.bind(this);
    this._handleMouseDown = this._handleMouseDown.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);
    this._handleZoomIn = this._handleZoomIn.bind(this);
    this._handleZoomOut = this._handleZoomOut.bind(this);
    this._renderZoomIn = this._renderZoomIn.bind(this);
  }

  componentDidMount() {
    this._getLimit();
  }

  componentDidUpdate() {
    this._getLimit();
  }

  _updateThumbnails() {
    const thumbnails = this.thumbnails;
    this.thumbnails = thumbnails.map((thumbnail, i) => thumbnail = !!this.refs[`image${i}`]['clientWidth'] ? this.refs[`image${i}`]['clientWidth']: thumbnail);
  }

  _getLimit() {
    this._updateThumbnails();
    this.limit = this.thumbnails.reduce((total, num) => { return total = total + num + 20}) - this.refs.thumbnail.clientWidth + 17;
  }

  _adjustThumbnail(index) {
    const { images } = this.props;
    if (index + 1 > images.length) return 0;
    const { translateX } = this.state;

    this._updateThumbnails();
    const actualWidth = this.thumbnails.slice(0, index + 1).reduce((total, num) => { return total + num + 20 }) + 20;
    const max = translateX < 0 ? this.refs.thumbnail.clientWidth - translateX : this.refs.thumbnail.clientWidth;
    const min = index === 0 ? 0 : this.thumbnails.slice(0, index).reduce((total, num) => { return total + num + 20 }) + 20;

    if (actualWidth > max) {
      return this.refs.thumbnail.clientWidth - actualWidth;
    } else if (min + translateX < 0) {
      return -min;
    }
    return 0;
  }

  _slideToIndex(index) {
    const translateX = this._adjustThumbnail(index);
    this.setState(prev => ({
      prevIndex: prev.currentIndex,
      currentIndex: index,
      translateX: !!translateX ? translateX : prev.translateX
    }));
  }

  _slideToPrevious() {
    const { currentIndex } = this.state;
    if (currentIndex !== 0) {
      const translateX = this._adjustThumbnail(currentIndex - 1);
      this.setState(prev => ({
        prevIndex: prev.currentIndex,
        currentIndex: prev.currentIndex - 1,
        translateX
      }));
    }
  }

  _slideToNext() {
    const { currentIndex } = this.state;
    const { images } = this.props;
    if (currentIndex + 1 !== images.length) {
      const translateX = this._adjustThumbnail(currentIndex + 1);
      this.setState(prev => ({
        prevIndex: prev.currentIndex,
        currentIndex: prev.currentIndex + 1,
        translateX
      }));
    }
  }

  _renderArrow(direction, onClick) {
    const boxClassName= classNames('component-gallery_arrow-box', {
      'component-gallery_arrow-box-left': direction === 'left',
      'component-gallery_arrow-box-right': direction === 'right'
    });
    return (
      <div key={direction} className={boxClassName}>
        <img
          src='./images/icons/png/gallery-arrow.png'
          className={classNames('component-gallery_arrow', {'component-gallery_arrow-right': direction === 'right'})}
          onClick={onClick}
          alt=''
        />
      </div>
    )
  }

  _renderThumbnailArrow(direction, onClick) {
    const { translateX } = this.state;
    const boxClassName= classNames('component-gallery_arrow-box', {
      'component-gallery_thumbnail-box-left': direction === 'left',
      'component-gallery_thumbnail-box-right': direction === 'right'
    });
    return (
      <div key={direction} className={boxClassName}>
        <img
          src='./images/icons/png/gallery-arrow1.png'
          className={classNames('component-gallery_thumbnail_arrow', {'component-gallery_arrow-right': direction === 'right'})}
          onClick={(translateX < 0 && direction === 'left') || (translateX > -this.limit && direction === 'right') ? () => onClick(direction) : null}
          onMouseDown={() => this._handleMouseDown(direction)}
          onMouseUp={this._handleMouseUp}
          alt=''
        />
      </div>
    )
  }

  _renderImage({url}, index) {
    const { prevIndex, currentIndex } = this.state;
    const className = classNames('component-gallery_img-box', {
      'component-gallery_img-to-right': index === prevIndex && currentIndex < prevIndex,
      'component-gallery_img-from-left': index === currentIndex && currentIndex < prevIndex,
      'component-gallery_img-to-left': index === prevIndex && currentIndex > prevIndex,
      'component-gallery_img-from-right': index === currentIndex && currentIndex > prevIndex,
      'component-gallery_img-box-left': index < currentIndex,
      'component-gallery_img-box-right': index > currentIndex
    });
    return (
      <div key={index} className={className}>
        <img 
          src={url}
          className='component-gallery_img'
          onClick={() => this._handleZoomIn(url)}
          alt=''
        />
      </div>
    )
  }

  _renderThumbnail({thumbnail}, index) {
    const { currentIndex, translateX } = this.state;
    const transformX = 'translateX(' + translateX + 'px)';
    let style = {
      transform: transformX,
      WebkitTrabsform: transformX,
      MozTransform: transformX,
      msTransform: transformX,
      OTransform: transformX,
      transition: '0.05s'  
    }
    const className = classNames('component-gallery_thumbnail-box', {
      'component-gallery_thumbnail-selected': currentIndex === index
    });
    const refs = `image${index}`;
    return (
      <div key={index} ref={refs} className={className} style={style}>
        <img
          src={thumbnail}
          className='component-gallery_img'
          onClick={() => this._slideToIndex(index)}
          alt=''
        />
      </div>
    )
  }

  _renderCanvas() {
    const { images } = this.props;
    return (
      <Ratio ratio={ 4 / 3 } className='component-gallery_canvas'>
        {images.map(this._renderImage)}
      </Ratio>
    );
  }

  _renderThumbnailBar() {
    const { images } = this.props;
    return (
      <div ref={'thumbnail'} className='component-gallery_thumbnail_bar'>
        {images.map(this._renderThumbnail)}
      </div>
    );
  }

  _moveThumbnailBar(direction) {
    const { translateX } = this.state;
    if ((translateX < 0 && direction === 'left') || (translateX > -this.limit && direction === 'right')) {
      this.setState(prev => ({
        translateX: prev.translateX + (direction === 'left' ? 30 : -30)
      }));
    } else {
      this._handleMouseUp();
    }
  }

  _handleMouseDown(direction) {
    this.timer = setInterval(() => {
      this._moveThumbnailBar(direction);
    }, 50);
  }

  _handleMouseUp() {
    window.clearInterval(this.timer);
    this.timer = null;
  }

  _handleZoomIn(zoomInUrl) {
    this.setState({
      zoomIn: true,
      zoomInUrl
    })
  }

  _handleZoomOut() {
    this.setState({
      zoomOut: true
    }, () => { 
      setTimeout(async ()=> {
        await this.setState({
          zoomIn: false,
          zoomOut: false,
          zoomInUrl: ''
        });
      }, 750)
    });
  }

  _renderZoomIn() {
    const { zoomIn, zoomOut, zoomInUrl } = this.state;
    if (!zoomIn) { return null; }
    return (
      <div className='component-gallery_modal'>
        <div className='component-gallery_modal-image-box'>
          <img
            src={zoomInUrl}
            className={classNames('component-gallery_modal-image', {'component-gallery_modal-close-animation': zoomOut})}
            alt=''
          />
          {
            !zoomOut && <img
                          src='./images/icons/png/gallery-cross.png'
                          className='component-gallery_modal-close'
                          onClick={this._handleZoomOut}
                          alt=''
                        />
          }
        </div>
      </div>
    )
  }

  render() {
    const canvas = this._renderCanvas();
    const thumbnailBar = this._renderThumbnailBar();
    const { zoomIn } = this.state;
    return (
      <div className='component-gallery_container'>
        <div className='component-gallery_canvas-box'>
          {this._renderArrow('left', this._slideToPrevious)}
          {canvas}
          {this._renderArrow('right', this._slideToNext)}
        </div>
        <div className='component-gallery_canvas-box'>
          {this._renderThumbnailArrow('left',  this._moveThumbnailBar)}
          {thumbnailBar}
          {this._renderThumbnailArrow('right', this._moveThumbnailBar)}
        </div>
        {zoomIn && this._renderZoomIn()}
      </div>
    );
  }
}