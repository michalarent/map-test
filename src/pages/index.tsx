import Image from 'next/image'
import {Inter} from 'next/font/google'
import Map from "@/components/Map";
import dynamic from "next/dynamic";

const inter = Inter({subsets: ['latin']})

const DynamicMap = dynamic(() => import('@/components/Map'), {ssr: false})
export default function Home() {
    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
        >
            <DynamicMap/>
        </main>
    )
}
