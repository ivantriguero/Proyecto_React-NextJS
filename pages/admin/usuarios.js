import AdminTemplate from "./Admintemplate"
import {AiFillEdit, AiOutlineArrowLeft, AiOutlineArrowRight} from 'react-icons/ai'
import {FiDelete} from 'react-icons/fi'
import Modal from '../../components/Modal'
import AvisoModal from '../../components/AvisoModal'
import { useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import $ from "jquery"
import Cookies from 'js-cookie';
import { motion } from "framer-motion"


const Usuarios =({usuarios, rows}) => {
    let token = Cookies.get('accessToken')
    if(token==undefined||token==null){
        token=''
    }
    const config = {
        headers:{
            authorization: token
        }
      };
    const router = useRouter();
    // Call this function whenever you want to
    // refresh props!
    const refreshData = () => {
        router.replace(router.asPath);
    }
    const [formValue, setFormValue] = useState({
        email : '',
        clave : '',
        nombre: '',
        dni:'',
        telefono:''
    });
    const handleChange = (e) =>{
        const {name, value} = e.target
        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    const [mensaje, setMensaje] = useState({
        mensaje: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const {email, clave, nombre, dni, telefono}=formValue
        const res = await axios.post('/api/usuarios', {
            email:[email],
            clave: [clave],
            nombre: [nombre],
            dni: [dni],
            telefono: [telefono]
        },config)
        if(res.status==200){
            setMensaje(()=>{
                return{
                    mensaje: 'Usuario creado correctamente'
                }
            })
            openModalAviso()
        }else{

        }
        refreshData()
    }

    const handleSubmitEditar = async (e) => {
        e.preventDefault()
        const {id, email, clave, nombre, dni, telefono}=formValue
        const res = await axios.put('/api/usuarios', {
            id: [id],
            email:[email],
            clave: [clave],
            nombre: [nombre],
            dni: [dni],
            telefono: [telefono]
        }, config)
        if(res.status==200){
            setMensaje(()=>{
                return{
                    mensaje: 'Usuario editado correctamente'
                }
            })
            openModalAviso()
        }else{

        }
        refreshData()
    }

    const handleSubmitEliminar = async (e) => {
        e.preventDefault()
        const id=formValue.id
        const res = await axios.delete('/api/usuarios', {
            headers:{
                authorization: token
            },
            data:{
                id: id
            },
            
        })
        if(res.status==200){
            setMensaje(()=>{
                return{
                    mensaje: 'Usuario eliminado correctamente'
                }
            })
            if(showModalAviso){
                setShowModalAviso(prev => !prev)
                openModalAviso()
            }else{
                openModalAviso()
            }
        }else{

        }
        refreshData()
        setShowModalEliminar(prev => !prev)
    }

    const [showModalCrear, setShowModalCrear]=useState(false)
    const openModalCrear = () => {
        setShowModalCrear(prev => !prev)
    }

    const [showModalEditar, setShowModalEditar]=useState(false)
    const openModalEditar = (e) => {
        setShowModalEditar(prev => !prev)
        pasarDatos(e)
    }
    
    const [showModalEliminar, setShowModalEliminar]=useState(false)
    const openModalEliminar = (e) => {
        setShowModalEliminar(prev => !prev)
        pasarDatosEliminar(e)
    }

    const [showModalAviso, setShowModalAviso]=useState(false)
    const openModalAviso = (e) => {
        if(showModalAviso){
            setShowModalAviso(prev => prev)
        }else{
            setShowModalAviso(prev => !prev)
        }
    }

    
    const [showPage, setShowPage]=useState(0)
    
    const nextPage = () => {
        setShowPage((prevState) => {
            return prevState+1
        })
    }

    const prevPage = () => {
        setShowPage((prevState) => {
            return prevState-1
        })
    }

    const crearUsuario = <button onClick={openModalCrear} className="bg-green-600 text-white px-5 py-2 hover:bg-green-700">Añadir usuario +</button>

    const pasarDatos = (e) => {
        let idUsuario = $(e.currentTarget).parent().siblings().eq(0).attr("id");
        let emailUsuario = $(e.currentTarget).parent().siblings().eq(1).attr("uservalue");
        let nombreUsuario = $(e.currentTarget).parent().siblings().eq(2).attr("uservalue");
        let dniUsuario = $(e.currentTarget).parent().siblings().eq(3).attr("uservalue");
        let telefonoUsuario = $(e.currentTarget).parent().siblings().eq(4).attr("uservalue");
        setFormValue(() =>{
            return {
                id: idUsuario,
                email : emailUsuario,
                clave : '',
                nombre: nombreUsuario,
                dni:dniUsuario,
                telefono:telefonoUsuario
            }
        })
    }

    const pasarDatosEliminar = (e) => {
        let idUsuario = $(e.currentTarget).parent().siblings().eq(0).attr("id");
        setFormValue(() =>{
            return {
                id: idUsuario
            }
        })

    }

    return (
        <div className=" w-full">
            <AvisoModal id="modalAviso" mensaje={mensaje.mensaje} showModal={showModalAviso} setShowModal={setShowModalAviso}>
            </AvisoModal>
       
            <AdminTemplate button={crearUsuario} title="Usuarios">

                <Modal id="modalEliminar" showModal={showModalEliminar} setShowModal={setShowModalEliminar}>
                    <div className="py-10 px-10">
                        <h1 className="text-center border-b-2">Eliminar usuario</h1>
                        <p className="py-5">¿Está seguro de que quiere eliminar el registro?</p>
                        <form className="flex flex-col" onSubmit={handleSubmitEliminar}>
                            <input type="hidden" name="id" value={formValue.id}/>
                            <button type="submit" className="bg-red-500 mt-5 px-5 py-3 rounded-lg hover:bg-red-700">Eliminar</button>
                            <button type="submit" onClick={openModalEliminar} className="bg-gray-500 mt-5 px-5 py-3 rounded-lg hover:bg-gray-600">Cancelar</button>
                        </form>
                    </div>
                </Modal>

                <Modal showModal={showModalCrear} setShowModal={setShowModalCrear}>
                    <div className="py-10 px-10">
                        <h1 className="text-center">Crear nuevo usuario</h1>
                        <form className="flex flex-col" onSubmit={handleSubmit}>
                            <label className="py-2">Email:</label>
                            <input type="email" onChange={handleChange} name="email" className="py-2 px-2 bg-gray-300 rounded-lg"/>
                            <label className="py-2">Contraseña:</label>
                            <input type="password" onChange={handleChange} name="clave" className="py-2 px-2 bg-gray-300 rounded-lg"/>
                            <div className="columns-2">
                                <div>
                                    <label className="py-2">Nombre:</label><br />
                                    <input type="text" onChange={handleChange} name="nombre" className="py-2 px-2 bg-gray-300 rounded-lg"/>
                                </div>
                                <div>
                                    <label className="py-2">DNI:</label><br />
                                    <input type="text" onChange={handleChange} name="dni" className="py-2 px-2 bg-gray-300 rounded-lg"/>
                                </div>
                            </div>
                            <label className="py-2">Teléfono:</label>
                            <input type="text" onChange={handleChange} name="telefono" className="py-2 px-2 bg-gray-300 rounded-lg"/>
                            <button type="submit" className="bg-green-500 mt-5 px-5 py-3 rounded-lg hover:bg-green-600">Crear Usuario</button>
                        </form>
                    </div>
                </Modal>

                <Modal id="modalEditar" showModal={showModalEditar} setShowModal={setShowModalEditar}>
                <div className="py-10 px-10">
                        <h1 className="text-center">Editar usuario</h1>
                        <form onSubmit={handleSubmitEditar} id="formEditar" className="flex flex-col">
                            <label className="py-2">Email:</label>
                            <input id="editaremail" type="email" onChange={handleChange} value={formValue.email} name="email" className="py-2 px-2 bg-gray-300 rounded-lg"/>
                            <label className="py-2">Nueva Contraseña:</label>
                            <input type="password" onChange={handleChange} value={formValue.clave} name="clave" className="py-2 px-2 bg-gray-300 rounded-lg"/>
                            <div className="columns-2">
                                <div>
                                    <label className="py-2">Nombre:</label><br />
                                    <input id="editarnombre" type="text" onChange={handleChange} value={formValue.nombre} name="nombre" className="py-2 px-2 bg-gray-300 rounded-lg"/>
                                </div>
                                <div>
                                    <label className="py-2">DNI:</label><br />
                                    <input  id="editardni" type="text" onChange={handleChange} value={formValue.dni} name="dni" className="py-2 px-2 bg-gray-300 rounded-lg"/>
                                </div>
                            </div>
                            <label className="py-2">Teléfono:</label>
                            <input id="editartelefono" type="text" onChange={handleChange} value={formValue.telefono} name="telefono" className="py-2 px-2 bg-gray-300 rounded-lg"/>
                            <button type="submit" className="bg-green-500 mt-5 px-5 py-3 rounded-lg hover:bg-green-600">Editar Usuario</button>
                        </form>
                    </div>
                </Modal>
                <motion.div
                    initial={{ x: 1000,opacity:0 }}
                    animate={{ x: 0, opacity:1 }}
                    transition={{duration: 1 }}
                    exit={{ y: 1000,opacity:0 }}
                    className="flex justify-between flex-col w-full h-full px-5">
                    <table className="table-auto shadow-xl">
                    <thead className="bg-slate-800 text-white">
                        <tr>
                            <td className="px-14 text-center py-3 border-r-2 border-slate-900 rounded-tl-lg">#</td>
                            <td className="px-14 text-center py-3 border-r-2 border-slate-900">emailUsuario</td>
                            <td className="px-14 text-center py-3 border-r-2 border-slate-900">Nombre</td>
                            <td className="px-14 text-center py-3 border-r-2 border-slate-900">DNI</td>
                            <td className="px-14 text-center py-3 border-l-2 border-slate-900">Teléfono</td>
                            <td className="px-14 text-center py-3 border-l-2 border-slate-900 rounded-tr-lg"></td>
                        </tr>
                    </thead>
                    <tbody>
                        {rows[showPage]?.map((usuario, index) => (
                        <tr id="parent" key={usuario.idUsuario}>
                            <td id={usuario.idUsuario} uservalue={usuario.idUsuario} className="text-center py-3 border-x-2 border-gray">{usuario.idUsuario}</td>
                            <td uservalue={usuario.emailUsuario} className="text-center py-3 border-r-2 border-gray px-2">{usuario.emailUsuario}</td>
                            <td uservalue={usuario.nombreDonante} className="text-center py-3 border-r-2 border-gray px-2">{usuario.nombreDonante}</td>
                            <td uservalue={usuario.dniDonante} className="text-center py-3 border-r-2 border-gray">{usuario.dniDonante}</td>
                            <td uservalue={usuario.telefonoDonante} className="text-center py-3 border-r-2 border-gray">{usuario.telefonoDonante}</td>
                            <td className="text-center py-3 border-r-2 border-gray">
                                    <button onClick={openModalEditar} className="bg-orange-500 text-white p-2 rounded-lg mr-2 hover:bg-orange-600"><AiFillEdit /></button>
                                    <button onClick={openModalEliminar} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"><FiDelete /></button>
                                </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center mt-5">
                {showPage==0?
                        <button onClick={prevPage} disabled className="opacity-75 text-white bg-slate-800 mr-5 px-4 py-3 rounded-lg"> <AiOutlineArrowLeft /> </button>
                    :   <button onClick={prevPage} className="text-white bg-slate-800 mr-5 px-4 py-3 rounded-lg"> <AiOutlineArrowLeft /> </button>
                }                    {showPage==rows.length-1?
                        <button onClick={nextPage} disabled className="opacity-75 text-white bg-slate-800 mr-5 px-4 py-3 rounded-lg"> <AiOutlineArrowRight /> </button>
                    :   <button onClick={nextPage} className="text-white bg-slate-800 mr-5 px-4 py-3 rounded-lg"> <AiOutlineArrowRight /> </button>
                }
                </div>

                </motion.div>
            </AdminTemplate>
        </div> 
    )
    
}

export const getServerSideProps =async context =>{
    let token = context.req.cookies['accessToken']
    if(token==undefined||token==null){
        token=''
    }
    const config = {
        headers:{
            authorization: token
        }
      };
      try{
          const { data }= await axios.get('http://localhost:3000/api/usuarios', config)
          let rows=[]
          let row=[]
          data.forEach(function(usuario, index) {
              row.push(usuario)
              if(row.length==7||index==data.length-1){
                  rows.push(row)
                  row=[]
              }
          });
          return {
            props: {
                usuarios: data,
                rows: rows
            }
        }
      }catch(error){
        if(error.response.status==403){
            return {
                redirect: {
                  permanent: false,
                  destination: "/",
                },
                props:{},
              };
        }
      }


    
      
    
}

export default Usuarios