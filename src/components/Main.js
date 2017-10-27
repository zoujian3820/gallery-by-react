require('normalize.css/normalize.css');
require('styles/App.styl');

import React from 'react';

let imageDatas = require('../data/imageDatas.json')
imageDatas = (function (imageDatasArr) {
  return imageDatasArr.map(item => item.imageUrl = require(`../images/${item.fileName}`))
})(imageDatas)


//let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">
          6
        </section>
        <nav className="controller-nav">

        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
