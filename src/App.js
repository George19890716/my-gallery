import React, { Component } from 'react';
import './app.scss';
import Gallery from './components/Gallery';

export default class App extends Component {
  render() {
    const images = [
      {
        url: './example/1.jpg',
        thumbnail: './example/1.jpg'
      },
      {
        url: './example/2.jpg',
        thumbnail: './example/2.jpg'
      },
      {
        url: './example/3.jpg',
        thumbnail: './example/3.jpg'
      },
      {
        url: './example/4.jpg',
        thumbnail: './example/4.jpg'
      },
      {
        url: './example/5.jpg',
        thumbnail: './example/5.jpg'
      },
      {
        url: './example/6.jpg',
        thumbnail: './example/6.jpg'
      },
      {
        url: './example/7.jpg',
        thumbnail: './example/7.jpg'
      },
      {
        url: './example/8.jpg',
        thumbnail: './example/8.jpg'
      },
      {
        url: './example/9.jpg',
        thumbnail: './example/9.jpg'
      },
      {
        url: './example/10.jpg',
        thumbnail: './example/10.jpg'
      },
      {
        url: './example/11.jpg',
        thumbnail: './example/11.jpg'
      },
      {
        url: './example/12.jpg',
        thumbnail: './example/12.jpg'
      },
      {
        url: './example/13.jpg',
        thumbnail: './example/13.jpg'
      },
    ]
    return (
      <div className='div1'>
        <Gallery
          images={images}
        />
      </div>
    );
  }
}