namespace $.$$ {

	$mol_test({

		'Entry: корректное вычисление полей и ссылок'() {
			// Создадим тестовую запись, передавая значения в массиве согласно определению $optimade_zero_search_entry.
			// Формат записи: [ id, formula, property, data_type_index, is_public, bib_id, year, ref_id ]
			const entry = new $optimade_zero_entry([
				'P-1234',    // id
				'H2O',       // formula
				'PropX',     // property
				7,           // data_type_index
				true,        // is_public
				'bib123',    // bib_id
				2020,        // year
				999999      // ref_id
			]);

			$mol_assert_equal( entry.id(), 'P-1234' );
			$mol_assert_equal( entry.id_prefix(), 'P' );
			$mol_assert_equal( entry.type(), 'P' );
			$mol_assert_equal( entry.formula_html(), 'H2O' );
			$mol_assert_equal( entry.property(), 'PropX' );

			// Т.к. тип записи "P", ссылка на библиографическую информацию должна формироваться
			const expectedBibLink = `${ entry.api_uri() }/download/bib?ref_id=${ entry.ref_id() }&sid=&fmt=bib`;
			$mol_assert_equal( entry.ref_link(), expectedBibLink );

			// Для типов, отличных от "P", ссылка должна быть пустой
			// Например, если поменять тип на "C"
			const entryC = new $optimade_zero_entry([
				'C-5678',
				'NaCl',
				'PropY',
				8,
				true,
				'bib456',
				2021,
				123456
			]);
			$mol_assert_equal( entryC.ref_link(), '' );
		},

		'Search: параметры и API-представление'() {
			const search = new $optimade_zero_search;

			// Установим параметры поиска
			search.params({ elements: 'H,C', formulae: 'H2O' });
			$mol_assert_equal( JSON.stringify( search.params() ), JSON.stringify({ elements: 'H,C', formulae: 'H2O' }) );

			// Проверим разделитель для элементов (должен быть "-")
			$mol_assert_equal( search.separator('elements'), '-' );

			// Проверим API-представление параметров: строка должна содержать ключ "formulae" со значением "H2O"
			const apiQuery = search.params_api();
			$mol_assert_ok( apiQuery.indexOf('"formulae":"H2O"') >= 0 );
		},

		'Search: формирование меток параметров'() {
			const search = new $optimade_zero_search;
			// Устанавливаем параметры поиска с несколькими значениями
			search.params({ elements: 'H-C', formulae: 'H2O' });
			const labels = search.params_labels();
			// Для параметра "elements" ожидаем два значения (H и C), а для "formulae" – одно
			$mol_assert_equal( labels.length, 3 );
			$mol_assert_equal( labels[0].facet, 'elements' );
			$mol_assert_equal( labels[0].label, 'H' );
			$mol_assert_equal( labels[1].facet, 'elements' );
			$mol_assert_equal( labels[1].label, 'C' );
			$mol_assert_equal( labels[2].facet, 'formulae' );
			$mol_assert_equal( labels[2].label, 'H2O' );
		},

		'Search: arity вычисляется корректно'() {
			const search = new $optimade_zero_search;
			// Если параметр formulae не задан, то arity вычисляется исходя из количества элементов
			search.params({ elements: 'H-C-O' });
			const arity = search.arity();
			// Если элементов 3, ожидаем, что arity будет заполнено именами с 3 по 4 (например, ternary, quaternary, quinary, multinary)
			// В данном примере код добавляет имена от текущего количества до 5
			$mol_assert_ok( arity.length > 0 );
		},

		'Search: suggestions возвращает корректный формат'() {
			const search = new $optimade_zero_search;
			// Здесь мы не можем выполнить настоящий HTTP-запрос, поэтому проверим формат возвращаемых данных
			// Если $mol_fetch.json возвращает, например, пустой массив для пустого запроса, то
			$mol_assert_equal( search.suggests('nonexistent_query'), [] );
		},
	})
}
