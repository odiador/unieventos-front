"use client";

import { IconEdit, IconPlus, IconUpload, IconX } from "@tabler/icons-react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const DropZone = ({ img, setImage }: { img?: string, setImage: Dispatch<SetStateAction<string | undefined>> }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setImage(URL.createObjectURL(acceptedFiles[0]))
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const control2 = useAnimation();
    const control = useAnimation();
    useEffect(() => {
        control2.start(isDragActive ? "show" : "noshow");
        control.start(isDragActive ? "show" : "noshow");
    }, [isDragActive])
    return (
        <div className="rounded-lg w-fit group flex flex-col"
            onMouseEnter={() => control.start("show")}
            onMouseLeave={() => control.start("noshow")}
        >
            <motion.div
                variants={{
                    show: {
                        y: 0,
                    },
                    noshow: {
                        y: 30
                    }
                }}
                animate={control}
                transition={{ duration: 0.2 }}
                className="text-xs bg-white w-full flex rounded-t-lg text-black justify-end pr-2">
                <IconX className="cursor-pointer"
                    onClick={() => {
                        setImage(process.env.NEXT_PUBLIC_DEFAULT_IMAGE)
                    }} />

            </motion.div>
            <section className="relative size-40 cursor-pointer z-[1] bg-black rounded-b-lg" >
                <div {...getRootProps()} className="w-full h-full z-10 outline-none flex items-center justify-center">
                    <input {...getInputProps({ multiple: false, accept: "image/*" })} />
                    {isDragActive && <IconUpload />}
                    {!isDragActive && !img && <IconPlus />}
                    {!isDragActive && img && <IconEdit />}
                </div>
                {<motion.div
                    animate={control2}
                    initial="noshow"
                    variants={{
                        show: { opacity: 0.25 },
                        noshow: { opacity: 1 },
                    }}
                    transition={{ duration: 0.1 }}
                >
                    <Image className="size-full group-hover:opacity-25 rounded-b-lg absolute top-0 opacity-100 transition-opacity left-0 select-none pointer-events-none"
                        width={512} height={512} src={img || process.env.NEXT_PUBLIC_DEFAULT_IMAGE || ""} alt={img || process.env.NEXT_PUBLIC_DEFAULT_IMAGE || ""} />
                </motion.div>}
            </section>

        </div>
    );
}

export default DropZone;
