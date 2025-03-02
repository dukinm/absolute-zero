namespace $.$$ {

	$mol_style_define( $optimade_zero, {

		/* Шапка */
		$mol_page_head: {
			backgroundColor: 'transparent',
			boxShadow: 'none',
		}, 
		/* Контейнер страницы результатов */
		Search_page: {
			flex: {
				basis: 'auto',
				grow: 1,
			},
			padding: '2vh 2vw',
			background: '#fff',
		},

		/* Стили для ячеек списка результатов */
		Id: {
			padding: $mol_gap.text,
			// width: '7rem',
			// fontSize: '4vh',
		},

		Bib: {
			padding: $mol_gap.text,
			// width: '7rem',
			// fontSize: '4vh',
		},

		Property: {
			padding: $mol_gap.text,
			// fontSize: '3.5vh',
		},

		/* Сообщения об ошибке или отсутствии результатов */
		Search_error: {
			padding: '100px',
			margin: 'auto',
			color: 'red',
			textAlign: 'center',
		},

		Search_nothing_found: {
			padding: '100px',
			margin: 'auto',
			fontSize: '4vh',
			color: '#555',
			textAlign: 'center',
		},

		/* Дополнительное оформление строки результата */
		$mol_row: {
			margin: '1vh 0',
			padding: '1vh 0',
			borderBottom: '1px solid #ddd',
		},

	} )
}
