const getImageFromString = async (img: string) => {
    const response = await fetch(img);
    const blob = await response.blob();
    return new File([blob], `uploadedImage.${blob.type.split('/')[1]}`, { type: blob.type });
}


/**
 * 
 * @param num 
 * @returns 
 */
function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
}

function formatTime(date: Date) {
    return `${padTo2Digits(date.getHours())}:${padTo2Digits(date.getMinutes())}`
}

export { getImageFromString, formatTime };