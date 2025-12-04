import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles((theme) =>
	createStyles({
		root: {
			width: "100%",
			"& > * + *": {
				marginTop: theme.spacing(2),
			},
		},
	})
);

const ProgressBar = () => {
	const classes = useStyles();

	return <LinearProgress className={classes.root} />;
};

export default ProgressBar;
