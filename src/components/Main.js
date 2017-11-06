require('normalize.css/normalize.css');
require('styles/App.styl');

import React from 'react';
import ReactDOM from 'react-dom';

let imageDatas = require('../data/imageDatas.json')

imageDatas = (function (imageDatasArr) {
  return imageDatasArr.map((item) => {
    item.imageUrl = require(`../images/${item.fileName}`);
    return item;
  })
})(imageDatas)

/*
 * 获取区间内的一个随机值
 **/
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low)
}

let ImgFigure = React.createClass({
  render() {

    let styleObj = {}

    //如果props属性中指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos
    }

    return (
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">
            {this.props.data.title}
          </h2>
        </figcaption>
      </figure>
    );
  }
})
//let yeomanImage = require('../images/yeoman.png');

//class AppComponent extends React.Component {
let AppComponent = React.createClass({
  Constant: {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {
      x: [0, 0],
      topY: [0, 0]
    }
  },
  getInitialState(){
    return {
      imgsArrangeArr: [
        //{
        //  pos: {
        //    left: '0',
        //    top: '0'
        //  }
        //}
      ]
    }
  },
  /*
   * 重新布局所有图片
   * @param centerIndex 指定居中排布哪个图片
   * */
  rearrange(centerIndex){
    let imgsArrangeArr = this.state.imgsArrangeArr
    let Constant = this.Constant
    let centerPos = Constant.centerPos
    let hPosRange = Constant.hPosRange
    let vPosRange = Constant.vPosRange
    let hPosRangeLeftSecX = hPosRange.leftSecX
    let hPosRangeRightSecx = hPosRange.rightSecX
    let hPosRangeY = hPosRange.y
    let vPosRangeTopY = vPosRange.topY
    let vPosRangeX = vPosRange.x

    let imgsArrangeTopArr = []
    let topImgNum = Math.ceil(Math.random() * 2)

    //取一个或者不取
    let topImgSpliceIndex = 0

    let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1)

    //首先居中centerIndex的图片
    imgsArrangeCenterArr[0].pos = centerPos

    //取出要面布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum))
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum)

    //布局位于上侧的图片
    imgsArrangeTopArr.forEach((value, index)=> {
      imgsArrangeTopArr[index].pos = {
        top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
        left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
      }
    })

    //布局左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null

      //前半部分布局在左边，右半部分在布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX
      } else {
        hPosRangeLORX = hPosRangeRightSecx
      }

      imgsArrangeArr[i].pos = {
        top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
        left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
      }
    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0])

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    })
  },
  componentDidMount: function () {

    let stageDOM = ReactDOM.findDOMNode(this.refs.stage)
    let stageW = stageDOM.scrollWidth
    let stageH = stageDOM.scrollHeight
    let halfStageW = Math.ceil(stageW / 2)
    let halfStageH = Math.ceil(stageH / 2)

    //获取一个imageFigure的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0)
    let imgW = imgFigureDOM.scrollWidth
    let imgH = imgFigureDOM.scrollHeight
    let halfImgW = Math.ceil(imgW / 2)
    let halfImgH = Math.ceil(imgH / 2)

    //计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    //计算左侧，右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW
    this.Constant.hPosRange.y[0] = -halfImgH
    this.Constant.hPosRange.y[1] = stageH - halfImgH

    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3
    this.Constant.vPosRange.x[0] = halfStageW - imgW
    this.Constant.vPosRange.x[1] = halfStageW

    this.rearrange(0)
  },
  render() {
    let controllerUnits = [], imgFigures = [];
    imageDatas.forEach(function (value, index) {
        if (!this.state.imgsArrangeArr[index]) {
          this.state.imgsArrangeArr[index] = {
            pos: {
              left: 0,
              top: 0
            }
          }
        }
        imgFigures.push(<ImgFigure
          ref={'imgFigure'+index}
          arrange={this.state.imgsArrangeArr[index]}
          key={index} data={value}/>)
      }.bind(this)
    )
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
})

AppComponent.defaultProps = {};

export default AppComponent;
