import { useLayoutEffect, useState } from 'react';
import Svg, { Line } from 'react-native-svg';
import { Dimensions } from 'react-native';
import { useMetrics } from '../../contex/MetricsContext';


const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

let asd = [
  // {x: 50, y: 100},
  {x: 0, y: 0},
  {x: -80, y: 200},
  {x: 0, y: 400},
  {x: 80, y: 600},
  {x: 80, y: HEIGHT},
  // {x: 50, y: 400},
]

const drawLine = ({ dots }) => {
  let [lines, setLines] = useState([]);
  const { setMetrics } = useMetrics();

  useLayoutEffect(() => {
    let sublines = [];
    if(asd[0].y !== 0) {
      sublines.push(
        {
          id: -1,
          x1: 0, 
          y1: 0, 
          x2: asd[0].x, 
          y2: asd[0].y
        }
    )
    }
    let prevPoint = asd[0]
    for(let i = 1; i < asd.length; i++) {
      if(asd[i].y > prevPoint.y) {
        sublines.push(
          {
            id: i,
            x1: prevPoint.x, 
            y1: prevPoint.y, 
            x2: asd[i].x, 
            y2: asd[i].y
          }
        )
        prevPoint = asd[i]
      }
    }
    if(prevPoint.y < HEIGHT) {
      sublines.push(
        {
          id: 999999,
          x1: prevPoint.x,
          y1: prevPoint.y, 
          x2: 0, 
          y2: HEIGHT
        }
      )
    }
    setLines(sublines);

    setMetrics(sublines.map(subline => {
      let c = Math.sqrt(Math.pow(+subline.x2 - +subline.x1, 2) + Math.pow(+subline.y2 - +subline.y1, 2))
      let a = Math.sqrt(Math.pow(+subline.y2 - +subline.y1, 2))
      let b = Math.sqrt(Math.pow(+subline.x2 - +subline.x1, 2))
      let tg = b / a;
      if(subline.x1 > subline.x2) {
        tg = -tg;
      }
      let sin = a / c;
      let cos = b / c;
      return {sin, cos, x1: subline.x1, y1: subline.y1, x2: subline.x2, y2: subline.y2, tg, step: subline.x1};
    }))
  }, [])

  return (
    <Svg height="100%" width="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
      {lines.length > 0 && lines.map(ln => {
        return <Line x1={String(+ln.x1 + WIDTH / 2)} y1={ln.y1} x2={String(+ln.x2 + WIDTH /2)} y2={ln.y2} stroke="red" strokeWidth="2" key={ln.id}/>}
      )}
    </Svg>
  )
}

export default drawLine;