export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};


//Conseguir el color mas claro
export const getLightColorFromImage = (imageUrl) => {
    return new Promise((resolve, reject) => {
        //Cheque si la imagenUrl es valido
        if(!imageUrl || typeof imageUrl !== 'string') {
            return reject(new Error('URL de la imagen invalida'));
        }

        const img = new Image();

        // Si no hay un string de base64, crea un crossOrigin (CORS)
        if(!imageUrl.startsWith('data')){
            img.crossOrigin = "anonymous";
        }


        img.src = imageUrl;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            let r = 0, g = 0, b = 0, count = 0;

            for(let i=0; i <imageData.length; i += 4) {
                const red = imageData[i];
                const green = imageData[i +1];
                const blue = imageData[i+2];
                const brightness = [red + green + blue] / 3;

                // Solamente cuenta pixeles ligeros
                if(brightness > 100) {
                    r += red;
                    g += green;
                    b += blue;
                    count++;
                }

            }

            if (count === 0 ) {
                resolve('#ffffff');
            } else {
                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);
                resolve(`rgb ${r}.  ${g}. ${b}`);
            }

        };

        img.onerror = (e) => {
            console.error('X Se ha fallado al cargar la imagen');
            reject(new Error('La imagen no pudo ser cargada o fue bloqueada por el CORS'));
        };
    });
}