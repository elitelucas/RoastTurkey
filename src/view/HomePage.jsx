import React, { Component, Fragment } from 'react';
import About from '../components/about/about';
import MainSlider from '../components/mainSlider/mainSlider';

class HomePage extends Component {
  render() {
    return (
      <Fragment>
        <MainSlider fill="#1f58b1"/>
        <About fill="#061d1e" />
      </Fragment>
    );
  }
}

export default HomePage;