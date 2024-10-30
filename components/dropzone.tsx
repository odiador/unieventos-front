"use client";

import { getCroppedImg } from "@/api/utils/imagecropping";
import { IconEdit, IconPlus, IconUpload, IconX } from "@tabler/icons-react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { Dispatch, Fragment, SetStateAction, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper, { Area, Point } from "react-easy-crop";

const DropZone = ({ croppedImage, aspect, setImageCropped, initialImage }: { croppedImage?: string, setImageCropped: Dispatch<SetStateAction<string | undefined>>, initialImage: string, aspect: number }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setImg(URL.createObjectURL(acceptedFiles[0]))
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const control2 = useAnimation();
    const control = useAnimation();
    const [img, setImg] = useState<string | undefined>();
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
    useEffect(() => {
        control2.start(isDragActive ? "show" : "noshow");
        control.start(isDragActive ? "show" : "noshow");
    }, [isDragActive])


    useEffect(() => {
        if (croppedImage && croppedImage !== process.env.NEXT_PUBLIC_DEFAULT_IMAGE && croppedImage !== initialImage) {

        }
    }, [croppedImage])
    useEffect(() => {
        console.log(initialImage);
        setImageCropped(initialImage)
    }, [])
    return (
        <div className="rounded-lg w-fit group flex flex-col"
            onMouseEnter={() => control.start("show")}
            onMouseLeave={() => control.start("noshow")}
        >
            {img && <div className="top-0 left-0 absolute w-full flex flex-col items-center h-full bg-black/20 z-10">
                <Fragment>
                    <button className="z-10" onClick={() => {
                        if (croppedAreaPixels) {
                            getCroppedImg(img, croppedAreaPixels, { horizontal: false, vertical: false }).then((img) => {
                                setImageCropped(img || "")
                                setImg(undefined);
                            }).catch(() => { })
                        }
                    }}>Cortar</button>
                    <Cropper classes={{ containerClassName: "-z-10" }}
                        image={img}
                        aspect={aspect}
                        onCropChange={setCrop}
                        crop={crop}
                        onCropComplete={(croppedArea, croppedAreaPixels) => { setCroppedAreaPixels(croppedAreaPixels) }}
                    >
                    </Cropper>
                </Fragment>
            </div>}
            <motion.div
                variants={{ show: { y: 0, }, noshow: { y: 30 } }}
                animate={control}
                transition={{ duration: 0.2 }}
                className="text-xs bg-white w-full flex rounded-t-lg text-black justify-end pr-2">
                <IconX className="cursor-pointer"
                    onClick={() => {
                        setImageCropped(process.env.NEXT_PUBLIC_DEFAULT_IMAGE)
                    }} />

            </motion.div>
            <section className="relative w-40 cursor-pointer z-[1] bg-black rounded-b-lg" >
                <div {...getRootProps()} className="absolute top-0 left-0 size-full z-10 outline-none flex items-center justify-center">
                    <input {...getInputProps({ multiple: false, accept: "image/*" })} />
                    {isDragActive && <IconUpload />}
                    {!isDragActive && !croppedImage && <IconPlus />}
                    {!isDragActive && croppedImage && <IconEdit />}
                </div>
                {<motion.div
                    animate={control2}
                    initial="noshow"
                    variants={{ show: { opacity: 0.25 }, noshow: { opacity: 1 }, }}
                    transition={{ duration: 0.1 }}
                    className="z-10"
                >
                    <Image className="size-full group-hover:opacity-25 rounded-b-lg opacity-100 transition-opacity select-none pointer-events-none"
                        width={512} height={512} src={croppedImage || process.env.NEXT_PUBLIC_DEFAULT_IMAGE || ""} alt={img || process.env.NEXT_PUBLIC_DEFAULT_IMAGE || ""} />
                </motion.div>}
            </section>

        </div>
    );
}

export default DropZone;
