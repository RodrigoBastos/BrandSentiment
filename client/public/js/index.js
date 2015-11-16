$(document).ready(function()
{
  //instancia de socket en el lado cliente
  var socket = io.connect('http://localhost:3000'),
    spanish = 0,
    english = 0;

  //caputramos el evento twitter
  socket.on('twitter', function(data)
  {
    if(data.lang === "en")
    {
      english+= 1;
    }
    else if(data.lang === "es")
    {
      spanish+= 1;
    }
    $('.tweets').prepend('<li>' + data.text + '</li>');
    $('.countSpanish').html('').html('<h3>Hablando de playstation en español: '+spanish+'</h3>');
    $('.countEnglish').html('').html('<h3>Hablando de playstation en inglés: '+english+'</h3>');
  });
});