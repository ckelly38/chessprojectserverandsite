import React from "react";
import CommonClass from "./commonclass";

function NewPiece({formik, arrindx, rempiece})
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
    cc.letMustBeDefinedAndNotNull(formik, "formik");

    return (<>
        <label id="playercolorlbl" htmlFor="color">Color: </label>
        <select id="color" name="color" onChange={formik.handleChange}
            value={formik.values.colors[arrindx]}>
            {cc.genOptionListFromArray(["WHITE", "BLACK"], null)}
        </select>
        <select id="type" name="type" onChange={formik.handleChange}
            value={formik.values.types[arrindx]}>
            {cc.genOptionListFromArray(["KING", "QUEEN", "BISHOP", "KNIGHT", "CASTLE", "PAWN"],
                ["KING", "QUEEN", "BISHOP", "KNIGHT", "CASTLE (ROOK)", "PAWN"])}
        </select>
        {" LOC: ("}<select id="row" name="row" onChange={formik.handleChange}
            value={formik.values.rows[arrindx]}>
            {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7], null)}
        </select>{", "}
        <select id="col" name="col" onChange={formik.handleChange}
            value={formik.values.cols[arrindx]}>
            {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7], null)}
        </select>{") "}
        <label id="myinitmvcntlbl" htmlFor="myinitmvcnt">Move Count: </label>
        <input id="myinitmvcnt" type="number" step={1} min={0} name="move_count" placeholder={0}
            onChange={formik.handleChange} value={formik.values.move_counts[arrindx]} />
        <p> {formik.errors.move_count}</p>
        <p> {formik.errors.type}</p>
        <p> {formik.errors.row}</p>
        <p> {formik.errors.col}</p>
        <p> {formik.errors.color}</p>
        <button type="button" onClick={(event) => rempiece(arrindx)}>Remove Piece</button>
    </>);
}

export default NewPiece;
