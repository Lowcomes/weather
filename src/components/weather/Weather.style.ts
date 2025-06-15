import {styled, TableContainer, TableContainerProps } from "@mui/material";

export const TableContainerStyled = styled(TableContainer)<TableContainerProps>({
	maxHeight: 600,
	'& .MuiTableContainer-root': {
		scrollbarWidth: 'thin',
		scrollbarColor: '#c1c1c1 #f1f1f1',
	},
	'&::-webkit-scrollbar': {
		width: '8px',
		height: '8px',
	},
	'&::-webkit-scrollbar-track': {
		background: '#f1f1f1',
		borderRadius: '4px',
	},
	'&::-webkit-scrollbar-thumb': {
		background: '#c1c1c1',
		borderRadius: '4px',
		'&:hover': {
			background: '#a8a8a8',
		},
	},
});
