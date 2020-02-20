var request = require('request')
var fs = require('fs')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
var nodemailer = require('nodemailer')
require('dotenv').config()


var sent = false

setInterval(getVagas, 5000)

function getVagas() {
  request('https://www.dti.ufv.br/horario/horario.asp?ano=2020&semestre=1&depto=MAT', function(error, response, body) {
    if(response.statusCode == 200) {

      const dom = new JSDOM(body)

      var element = dom.window.document.getElementsByTagName('table')[2]
      for(let row of element.rows) {
        var mat = row.cells[0]
        var cod = mat.getElementsByTagName("font")[0]
        if(cod) {
          if(cod.innerHTML == "MAT 135<br>") {
            var vagas = row.cells[7].getElementsByTagName("font")[0].innerHTML
            if(vagas != "0<br>") {
              var d = new Date()
              console.log("SAIU VAGAAAA", d)
              var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.EMAILFROM,
                  pass: process.env.PW
                }
              })
              var mailOptions = {
                from: process.env.EMAILFROM,
                to: process.env.EMAILTO,
                subject: 'VAGA NA TURMA DE MAT 135',
                text: 'SAIU VAGA CORRE LAAAAA!'
              }
              if(!sent) {
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                })
                sent = true
              }
            }
          }
        }
      }
    }
  })
}
