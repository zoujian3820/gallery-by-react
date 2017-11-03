require('normalize.css/normalize.css');
require('styles/App.styl');

import React from 'react';

let imageDatas = require('../data/imageDatas.json')

imageDatas = (function (imageDatasArr) {
  return imageDatasArr.map((item) => {
    item.imageUrl = require(`../images/${item.fileName}`);
    return item;
  })
})(imageDatas)

let ImgFigure = React.createClass({
  render() {
    return (
      <figure>
        <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2></h2>
        </figcaption>
      </figure>
    );
  }
})
//let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    let controllerUnits = [],
      imgFigures = [];
    imageDatas.forEach(function (value,index) {
        imgFigures.push(<ImgFigure key={index} data={value}/>)
      }
    )
    return (
      <section className="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
