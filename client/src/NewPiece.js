import React from "react";
import CommonClass from "./commonclass";

function NewPiece({formik=null, arrindx, rempiece, getpcs})
{
    //select color
    //select type
    //select row
    //select col
    //get the initial number of moves for each piece
    
    //Add Pieces
    //color type row col num_moves ? add remove
    //color type row col num_moves ? add remove
    //color type row col num_moves ? add remove
    //color type row col num_moves ? add remove
    //submit

    let cc = new CommonClass();
    //cc.letMustBeDefinedAndNotNull(formik, "formik");
    cc.letMustBeDefinedAndNotNull(rempiece, "rempiece");
    cc.letMustBeDefinedAndNotNull(arrindx, "arrindx");
    if (cc.isInteger(arrindx));
    else throw new Error("arrindx must be an integer!");

    //formik.handleChange
    //formik.values.colors[arrindx]
    //formik.values.types[arrindx]
    //formik.values.rows[arrindx]
    //formik.values.cols[arrindx]
    //formik.values.move_counts[arrindx]
    //<p> {formik.errors.move_count}</p>
    //<p> {formik.errors.type}</p>
    //<p> {formik.errors.row}</p>
    //<p> {formik.errors.col}</p>
    //<p> {formik.errors.color}</p>
    return (<>
        <label id={"playercolorlbl" + arrindx} htmlFor={"color" + arrindx}>Color: </label>
        <select id={"color" + arrindx} name="color" onChange={null}
            value={"WHITE"}>
            {cc.genOptionListFromArray(["WHITE", "BLACK"], null)}
        </select>
        <select id={"type" + arrindx} name="type" onChange={null}
            value={"KING"}>
            {cc.genOptionListFromArray(["KING", "QUEEN", "BISHOP", "KNIGHT", "CASTLE", "PAWN"],
                ["KING", "QUEEN", "BISHOP", "KNIGHT", "CASTLE (ROOK)", "PAWN"])}
        </select>
        {" LOC: ("}<select id={"row" + arrindx} name="row" onChange={null}
            value={0}>
            {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7], null)}
        </select>{", "}
        <select id={"col" + arrindx} name="col" onChange={null}
            value={0}>
            {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7], null)}
        </select>{") "}
        <label id={"myinitmvcntlbl" + arrindx} htmlFor={"myinitmvcnt" + arrindx}>
            Move Count: </label>
        <input id={"myinitmvcnt" + arrindx} type="number" step={1} min={0}
            name="move_count" placeholder={0}
            onChange={null} value={0} />
        <button type="button" onClick={(event) => rempiece()}>
            Remove Piece</button>
    </>);
}

export default NewPiece;
