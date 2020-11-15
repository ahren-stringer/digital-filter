// 'use strict'
function kol() {
  let kolA = +document.getElementById('input__a').value;
  let kolB = +document.getElementById('input__b').value;
  let an = 1;
  debugger
  while (kolA != 0) {
    let div = document.createElement('div');
    let label = document.createElement('label');
    label.innerHTML = 'a' + an + ': '
    let input = document.createElement('input');
    div.append(label)
    div.append(input)
    document.getElementById('koef__a').append(div)
    an++
    --kolA
  }
  let bn = 0;
  while (kolB != 0) {
    let div = document.createElement('div');
    let label = document.createElement('label');
    label.innerHTML = 'b' + bn + ': '
    let input = document.createElement('input');
    div.append(label)
    div.append(input)
    document.getElementById('koef__b').append(div)
    bn++
    --kolB
  }
}
document.getElementById('kol').onclick = function (event) {
  event.preventDefault()
  kol()
}

function draw() {
  try {
    let k = 0;
    for (let i of document.getElementById('form').querySelectorAll('input')) {
      if (i.value == '') k++
    }
    if (k == 0) {

      let a = document.getElementById('koef__a').querySelectorAll('input');
      let b = document.getElementById('koef__b').querySelectorAll('input');
      let arr = [[], []];
      let yy = -1;
      for (let i of a) {
        let obj = {};
        obj.y = yy;
        obj.size = 0;
        obj.k = +i.value
        arr[0].push(obj)
        yy--
      }
      let xx = 0;
      for (let i of b) {
        let obj = {};
        obj.x = xx;
        obj.size = 0;
        obj.k = +i.value
        arr[1].push(obj)
        xx--
      }
      //let ih = [[{ y: -1, size: 0, k: a1 }, { y: -2, size: 0, k: a2 }], [{ x: 0, size: 0, k: b0 }, { x: -1, size: 0, k: b1 }, { x: -2, size: 0, k: b2 }]];
      let ih = [[], []];
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
          ih[i][j] = Object.assign({}, arr[i][j])
        }
      }
      let ihz = [];
      //импульсная характеристикка
      for (let i = 0; i <= 10; i++) {
        let yi = 0;
        while (ihz.length <= a.length) {
          let x = ih[1].find(item => item.x == 0);
          let y = ih[0].filter(item => item.y >= 0);
          if (!!x) { ++x.size } else break
          yi = y.reduce((sum, current) => sum + (current.size * current.k), 0) + (x.size * x.k)
          ihz.push(yi)
          --x.size
          ih[1] = ih[1].map(item => {
            item.x = item.x + 1
            return item
          })
          ih[0] = ih[0].map(item => {
            if (item.y >= -1) {
              item.size = ihz[item.y + 1]
              item.y = item.y + 1
              return item
            }
            item.y = item.y + 1
            return item
          })
        }
        let y = ih[0].filter(item => item.y >= 0);
        yi = y.reduce((sum, current) => sum + (current.size * current.k), 0)
        ihz.push(yi)
        ih[0] = ih[0].map(item => {
          if (item.y >= -1) {
            item.size = ihz[item.y + 1]
            item.y = item.y + 1
            return item
          }
          item.y = item.y + 1
          return item
        })
      }
      //let ph = [[{ y: -1, size: 0, k: a1 }, { y: -2, size: 0, k: a2 }], [{ x: 0, size: 0, k: b0 }, { x: -1, size: 0, k: b1 }, { x: -2, size: 0, k: b2 }]];
      let ph = [[], []];
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
          ph[i][j] = Object.assign({}, arr[i][j])
        }
      }
      let phz = [];
      //передаточная характеристика
      for (let i = 0; i <= 10; i++) {
        let yi = 0;
        let x = ph[1].filter(item => item.x >= 0);
        x = x.map(item => {
          if (item.size == 0) { item.size = 1 };
          return item
        });
        let y = ph[0].filter(item => item.y >= 0);
        yi = y.reduce((sum, current) => sum + (current.size * current.k), 0) + x.reduce((sum, current) => sum + (current.size * current.k), 0)
        phz.push(yi)
        ph[1] = ph[1].map(item => {
          item.x = item.x + 1
          return item
        })
        ph[0] = ph[0].map(item => {
          if (item.y >= -1) {
            item.size = phz[item.y + 1]
            item.y = item.y + 1
            return item
          }
          item.y = item.y + 1
          return item
        })
      }
      //АЧХ и ФЧХ
      //let achh = [[{ y: -1, size: 0, k: a1 }, { y: -2, size: 0, k: a2 }], [{ x: 0, size: 0, k: b0 }, { x: -1, size: 0, k: b1 }, { x: -2, size: 0, k: b2 }]];
      let achh = [[], []];
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
          achh[i][j] = Object.assign({}, arr[i][j])
        }
      }
      let n = b.length - 1;
      let bs1 = `(${achh[1][0].k})*cos(${n}*x)`;
      let bs2 = `(${achh[1][0].k})*sin(${n}*x)`;
      let as1 = `cos(${n}*x)`;
      let as2 = `sin(${n}*x)`;

      for (let i = 1; i < achh[1].length; i++) {
        n = n - 1
        bs1 = bs1 + `+(${achh[1][i].k})*cos(${n}*x)`
        bs2 = bs2 + `+(${achh[1][i].k})*sin(${n}*x)`
        as1 = as1 + `-(${achh[0][i - 1].k})*cos(${n}*x)`;
        as2 = as2 + `-(${achh[0][i - 1].k})*sin(${n}*x)`;
      }

      let achhz = `sqrt((((${bs1})^2)+((${bs2})^2))/(((${as1})^2)+((${as2})^2)))`;
      let fchhz = `atan((${bs2})/(${bs1}))-atan((${as2})/(${as1}))`;
      // compile the expression once
      const expression = achhz
      console.log(achhz)
      //document.getElementById('eq').value
      const expr = math.compile(expression)

      // evaluate the expression repeatedly for different values of x
      const xValues = math.range(0, 11, 1).toArray()
      const xACHH = math.range(0, 3.5, 0.05).toArray()
      const yValues = xACHH.map(function (x) {
        return expr.evaluate({ x: x })
      })
      const width = xValues.map(item => 0.1)

      // render the plot using plotly
      const trace1 = {
        x: xValues,
        y: ihz,
        width: width,
        type: 'bar'
      }
      const data1 = [trace1]

      Plotly.newPlot('ih__plot', data1)

      const trace2 = {
        x: xValues,
        y: phz,
        width: width,
        type: 'bar'
      }
      const data2 = [trace2]

      Plotly.newPlot('ph__plot', data2)

      const traceA = {
        x: xACHH,
        y: yValues,
        width: width,
        type: 'scatter'
      }
      const dataA = [traceA]

      Plotly.newPlot('achh__plot', dataA)

      const expression_f = fchhz
      console.log(fchhz)
      //document.getElementById('eq').value
      const expr_f = math.compile(expression_f)

      // evaluate the expression repeatedly for different values of x
      const xFCHH = math.range(0, 3.5, 0.05).toArray()
      const yFCHH = xFCHH.map(function (x) {
        return expr_f.evaluate({ x: x })
      })

      const traceF = {
        x: xFCHH,
        y: yFCHH,
        width: width,
        type: 'scatter'
      }
      const dataF = [traceF]

      Plotly.newPlot('fchh__plot', dataF)
    } else {
      let div = document.createElement('div');
      div.innerHTML = 'Введите остальные коеффициенты'
      document.getElementById('form').after(div)
    }
  }
  catch (err) {
    console.error(err)
    alert(err)
  }
}

document.getElementById('form').onsubmit = function (event) {
  event.preventDefault()
  draw()
}

//draw()