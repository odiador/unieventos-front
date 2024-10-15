import { IconHeart } from "@tabler/icons-react"
import Link from "next/link"

const MadeBy = () => {
    return <div className=" text-white/10 w-full justify-center flex items-center text-center pb-1">
        <Link href={"https://github.com/odiador"} className="flex hover:scale-105 h-fit transition-all group text-white/10 hover:text-white cursor-pointer px-4 content-center text-base font-normal">
            {"Made with ❤ by "}
            <strong className="ml-1 font-black">
                {"Amador"}
            </strong>
        </Link>
    </div>
}
export default MadeBy;