import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import NewPiece from "./NewPiece";
import CommonClass from "./commonclass";

function PieceListForm(props)
{
    let cc = new CommonClass();
    
    //const prefsSignUpSchema = yup.object().shape({
    //    username: yup.string().required("You must enter a username!").min(1),
    //    password: yup.string().required("You must enter a password!").min(1),
    //    access_level: yup.number().positive().integer().min(1).max(2)
    //    .required("You must enter the access level!")
    //    .typeError("You must enter a positive integer that is either 1 or 2 here!"),
    //});
    const formSchema = yup.object().shape({
        color: yup.string().required("You must enter a color!"),
        type: yup.string().required("You must enter a piece type!"),
        row: yup.number().integer().min(0).max(7).required("You must enter a row!"),
        col: yup.number().integer().min(0).max(7).required("You must enter a col!"),
        move_count: yup.number().integer().min(0).max(100)
        .required("You must enter a move count!"),
    });

    const formik = useFormik({
        initialValues: {
            colors: [],
            types: [],
            move_counts: [],
            rows: [],
            cols: []
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log("values: ", values);
        },
    });

    

    const [mypieces, setMyPieces] = useState([]);
    console.log("mypieces = ", mypieces);

    function getPcs()
    {
        console.log("GETPCS: mypieces = ", mypieces);
        return mypieces;
    }

    function remPiece(mid)
    {
        console.log("INSIDE remPiece!");
        //console.log("REMPC indx = " + indx);
        console.log("REMPC: mpcs = ", getPcs());
        console.log("mid = " + mid);
        
        if (cc.isStringEmptyNullOrUndefined(getPcs()))
        {
            throw new Error("either illegal id (" + mid +
                ") or array was empty when not supposed to!");
        }
        //else;//do nothing

        let mynwpcs = getPcs().filter((mpc, index) => {
            console.log("REMPC: filter index = " + index);
            if (mpc.id === mid) return false;
            else return true;
        });
        console.log("REMPC: mynwpcs = ", mynwpcs);
        
        setMyPieces(mynwpcs);
    }

    function addPiece()
    {
        let mynwpcs = [...mypieces];
        console.log("ADDPC: OLD mypieces = ", mypieces);
        
        let mpc = (<NewPiece key={"pid" + mynwpcs.length} id={"pid" + mynwpcs.length}
        formik={formik} arrindx={mynwpcs.length}
        rempiece={remPiece.bind(this, "pid" + mynwpcs.length)} />);

        //mynwpcs.push(<NewPiece key={"pid" + mynwpcs.length} id={"pid" + mynwpcs.length}
        //    formik={formik} arrindx={mynwpcs.length}
        //    rempiece={remPiece.bind(this, "pid" + mynwpcs.length)} />);
        console.log("ADDPC: mynwpcs = ", mynwpcs);
        
        setMyPieces([...mypieces, mpc]);
    }

    console.log("mypieces = ", mypieces);

    return (<div style={{ backgroundColor: "cyan" }}><h1>New Piece List Form:</h1>
    <form onSubmit={formik.handleSubmit}>
        {mypieces}
        <button type="button" onClick={addPiece}>Add Piece</button>
        <input type="submit" value="Submit" />
    </form>
    </div>);
}

export default PieceListForm;
