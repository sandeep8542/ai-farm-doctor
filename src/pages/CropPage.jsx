import MainLayout from "../layout/MainLayout"
import Card from "../components/Card"
import { motion } from "framer-motion"

export default function CropPage(){

return(

<MainLayout>

<div className="grid grid-cols-2 gap-8">

<Card title="Crop Disease Detection">

<img
src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d"
className="rounded-lg"
/>

</Card>


<Card title="Voice Query Diagnosis">

<p className="text-gray-600 mb-6">
"The leaves on my tomato plants have dark spots and are wilting."
</p>

<motion.div
animate={{scale:[1,1.05,1]}}
transition={{repeat:Infinity,duration:2}}
className="bg-[#1f4f3f] text-white rounded-lg p-6 text-center"
>

🎤 Recording...

</motion.div>

<button className="mt-4 bg-green-700 text-white px-6 py-2 rounded">
Home
</button>

</Card>

</div>

</MainLayout>

)

}