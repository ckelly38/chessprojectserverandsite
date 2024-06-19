import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import NewPiece from "./NewPiece";

function PieceListForm(props)
{
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

    function remPiece(indx)
    {
        console.log("INSIDE remPiece! indx = " + indx);
        let mynwpcs = mypieces.filter((mpc, index) => {
            console.log("rem pc filter index = " + index);
            if (indx === index) return false;
            else return true;
        });
        setMyPieces(mynwpcs);
    }

    function addPiece()
    {
        let mynwpcs = [...mypieces];
        mynwpcs.push(<NewPiece key={"pid" + mynwpcs.length} formik={formik}
            arrindx={mynwpcs.length} rempiece={remPiece} />);
        setMyPieces(mynwpcs);
    }

    return (<div style={{ backgroundColor: "cyan" }}><h1>New Piece List Form:</h1>
    <form onSubmit={formik.handleSubmit}>
        {mypieces}
        <button type="button" onClick={addPiece}>Add Piece</button>
    </form>
    </div>);
}

export default PieceListForm;
