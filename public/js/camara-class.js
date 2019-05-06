class Camara {
  constructor(videoNode) {
    //la etiqueda video de HTML5, nos permite mostrar videos o un stream de datos
    this.videoNode = videoNode; //Cuando instancie la clase, necesito mandar el node del video <video></video>
  }

  encender() {
    if (navigator.mediaDevices) {
      //Validar si soporta los dispositivos multimedia
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: { width: 300, height: 300 }
          //{ audio: true, video: { facingMode: "user" } }  Solicitar camara frontal o environment para la trasera
        })
        .then(stream => {
          //Para pintar las imagenes en la etiqueta <video>
          this.videoNode.srcObject = stream;
          this.stream = stream; //Se ocupa para detener los datos mas adelante.
        });
    }
  }

  apagar() {
    //Detiene el video
    this.videoNode.pause();
    if (this.stream) {
      //Obtiene Video y Audio, [0] Video, [1] audio
      this.stream.getTracks()[0].stop;
    }
  }

  tomarFoto() {
    //Elemento para renderizar la foto.
    let canvas = document.createElement("canvas");
    canvas.setAttribute("width", 300);
    canvas.setAttribute("height", 300);

    //obtener el contexto del canvas
    let context = canvas.getContext("2d"); //Una simple imagen.

    //Dibujar la imagen dentro del canvas
    context.drawImage(this.videoNode, 0, 0, canvas.width, canvas.height);

    //Extraer la foto
    this.foto = context.canvas.toDataURL(); //Genera un stream en base 64 para utilizarse.

    //Limpieza
    canvas = null;
    context = null;
    return this.foto;
  }
}
