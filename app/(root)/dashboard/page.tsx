import Dropzone from '@/components/Dropzone'
import TableWrapper from '@/components/TableWrapper'
import { db } from '@/firebase'
import { FileTypes } from '@/typings'
import { auth } from '@clerk/nextjs'
import { collection, getDocs } from 'firebase/firestore'
import React from 'react'

const page = async () => {
    
    const {userId} = auth()
    const docs = await getDocs(collection(db, "users", userId!, "files"))

    const skeleton: FileTypes[] = docs.docs.map(doc =>({
        id: doc.id,
        filename: doc.data().filename || doc.id,
        timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
        fullName: doc.data().fullName,
        downloadURL: doc.data().downloadURL,
        type: doc.data().type,
        size: doc.data().size        
    }))

    // console.log(skeleton)

  return (
    <div>
        <Dropzone />
        <section className='container space-y-5'>
            <h2 className='font-bold'>All Files</h2>
            <div>   
                <TableWrapper skeleton={skeleton} />
            </div>
        </section>
    </div>
  )
}

export default page