namespace $.$$ {

	$mol_style_define( $optimade_zero_search_input, {

		width: '100%',

		Anchor: {
			flex: {
				direction: 'column',
			},
		},

		Suggest_formula: {
			Paragraph: {
				padding: 0,
			},
		},

		/* Стили для поля ввода (Query) – аналог input[type="text"] */
		Query: {
			height: '6vh',
			padding: '1vh',
			fontSize: '5vmin',
			border: '1px solid #555',
			boxSizing: 'content-box',
			borderRadius: '2px',
			backgroundColor: 'transparent',
			boxShadow: 'inset 0 5px 5px rgba(0,0,0,0.15)',
			outline: 'none',
		},

		/* Кнопка очистки ввода */
		Clear: {
			fontSize: '5vmin',
			color: '#3e3f95',
			cursor: 'pointer',
			padding: '1vh',
		},

		/* Контейнер для тегов выбранных параметров */
		Tags: {
			padding: '1vh 0',
			marginTop: '1vh',
		},

		/* Стили для отдельного тега (будет применяться через компонент Tag) */
		Tag: {
			display: 'inline-block',
			background: '#3e3f95',
			color: '#fff',
			padding: '0.5vh 1vh',
			marginRight: '0.5vh',
			borderRadius: '2px',
			fontSize: '4vmin',
		},

	} )
}
