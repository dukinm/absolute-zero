namespace $.$$ {
	/**
	 * Функция sanitizeHTML безопасно экранирует входной HTML,
	 * сохраняя только те теги, которые указаны в allowedTags.
	 *
	 * @param html Исходная строка HTML.
	 * @param allowedTags Массив имён тегов, которые разрешено сохранять (например, ['sub', 'sup']).
	 * @returns Строка HTML, безопасная для вставки в DOM.
	 */
	function sanitizeHTML(html: string, allowedTags: string[] = []): string {
		const allowedSet = new Set(allowedTags.map(tag => tag.toUpperCase()));
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');

		function processNode(node: Node): string {
			if (node.nodeType === Node.TEXT_NODE) {
				// Экранируем специальные символы
				return node.textContent
					?.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;') || '';
			}
			if (node.nodeType === Node.ELEMENT_NODE) {
				const el = node as Element;
				let inner = '';
				el.childNodes.forEach(child => {
					inner += processNode(child);
				});
				// Если тег разрешён, сохраняем его (без атрибутов)
				if (allowedSet.has(el.tagName)) {
					const tagName = el.tagName.toLowerCase();
					return `<${tagName}>${inner}</${tagName}>`;
				} else {
					// Иначе возвращаем только содержимое
					return inner;
				}
			}
			// Игнорируем прочие типы узлов
			return '';
		}

		let safeHtml = '';
		doc.body.childNodes.forEach(node => {
			safeHtml += processNode(node);
		});
		return safeHtml;
	}
	// Интерфейс конфигурации для каждого элемента
	interface ItemRendererConfig {
		// Функция для получения значения поля записи
		valueGetter: (obj: $optimade_zero_entry) => string;
		// Фабрика компонента, который отображает поле
		component: (obj: $optimade_zero_entry) => any;
		// Значение, которое считается пустым (не отображать компонент)
		emptyValue?: string;
	}


	export class $optimade_zero extends $.$optimade_zero {

		// Массивы значений для генерации примеров
		private randomClasses = ['metal', 'oxide', 'conductor', 'nonmetal'];
		private randomGroups = ['transitional', 'chalcogen', 'rare earth'];
		private randomFormulae = ['H2O', 'NaCl', 'CO2'];
		private randomLattices = ['cubic', 'tetragonal', 'orthorhombic'];
		private randomProps = ['magnetism', 'electronic properties', 'mechanical properties'];
		private randomAnonymous = ['ABC', 'AB2', 'ABC3'];
		private periodicElements = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'];

		// Вспомогательная функция для выбора случайного элемента массива
		private getRandomItem(arr: string[]): string {
			return arr[Math.floor(Math.random() * arr.length)];
		}

		// Функции для получения случайных значений
		private getRandomClass(): string { return this.getRandomItem(this.randomClasses); }
		private getRandomGroup(): string { return this.getRandomItem(this.randomGroups); }
		private getRandomFormula(): string { return this.getRandomItem(this.randomFormulae); }
		private getRandomLattice(): string { return this.getRandomItem(this.randomLattices); }
		private getRandomProp(): string { return this.getRandomItem(this.randomProps); }
		private getRandomAnonymous(): string { return this.getRandomItem(this.randomAnonymous); }
		private getRandomElements(count: number): string {
			let result: string[] = [];
			while (result.length < count) {
				const el = this.getRandomItem(this.periodicElements);
				if (!result.includes(el)) result.push(el);
			}
			return result.join('-');
		}

		// Метод генерации примера, имитирующий старую функцию WMCORE.generate_example()
		private generateExample(): { text: string, facets: string[], terms: string[] } {
			const scene = Math.floor(Math.random() * 8) + 1;
			let result = { text: '', facets: [] as string[], terms: [] as string[] };

			if (scene === 1) { // classes-elements
				result.facets = ['classes', 'elements'];
				result.terms = [this.getRandomClass(), this.getRandomElements(2)];
				result.text = result.terms[0] + ' ' + result.terms[1];
			} else if (scene === 2) { // classes-classes
				result.facets = ['classes', 'classes'];
				result.terms = [this.getRandomGroup(), this.getRandomClass()];
				result.text = result.terms[0] + ' group, ' + result.terms[1];
			} else if (scene === 3) { // formulae-lattices
				result.facets = ['formulae', 'lattices'];
				result.terms = [this.getRandomFormula(), this.getRandomLattice()];
				result.text = result.terms[0] + ' ' + result.terms[1] + ' crystal';
			} else if (scene === 4) { // props-classes
				result.facets = ['props', 'classes'];
				result.terms = [this.getRandomProp(), this.getRandomClass()];
				result.text = result.terms[0] + ' for ' + result.terms[1];
				if (!result.text.endsWith('d') && !result.text.endsWith('s'))
					result.text += 's';
			} else if (scene === 5) { // classes-lattices
				result.facets = ['classes', 'lattices'];
				result.terms = [this.getRandomClass(), this.getRandomLattice()];
				result.text = result.terms[0] + ', ' + result.terms[1] + ' crystal';
			} else if (scene === 6) { // elements-lattices
				result.facets = ['elements', 'lattices'];
				result.terms = [this.getRandomElements(1), this.getRandomLattice()];
				result.text = result.terms[0] + ', ' + result.terms[1] + ' crystal';
			} else if (scene === 7) { // props and anonymous formulae
				result.facets = ['props', 'formulae'];
				result.terms = [this.getRandomProp(), this.getRandomAnonymous()];
				result.text = result.terms[0] + ' ' + result.terms[1];
			} else { // props-formulae
				result.facets = ['props', 'formulae'];
				result.terms = [this.getRandomProp(), this.getRandomFormula()];
				result.text = result.terms[0] + ' of ' + result.terms[1];
			}

			return result;
		}

		// Мемоизированное свойство, возвращающее HTML с примером
		@ $mol_mem
		example_html(): string {
			const ex = this.generateExample();
			// Преобразуем цифры в нижние индексы (аналог replace(/\d/g, "&#x208$&;"))
			const text = ex.text.replace(/\d/g, match => `<sub>${ match }</sub>`);
			return `<i>e.g.</i> <a href="#!${ ex.facets[1] }=${ ex.terms[1] }/${ ex.facets[0] }=${ ex.terms[0] }" data-facet-a="${ ex.facets[0] }" data-facet-b="${ ex.facets[1] }" data-term-a="${ ex.terms[0] }" data-term-b="${ ex.terms[1] }">${ text }</a>`;
		}

		// Метод, который будет использоваться в view для вывода футера
		Footer() {
			return [this.example_html()];
		}

		@ $mol_mem
		search_params( next?: $optimade_zero_search_params ): $optimade_zero_search_params {
			return this.$.$mol_state_arg.dict( next ) ?? {}
		}

		search_page_body() {
			if( this.search_error() ) {
				return [
					this.Search_input(),
					this.Search_error(),
				]
			}

			// Используем вспомогательную функцию для формирования массива компонентов
			return [
				this.Search_input(),
				... ( this.Search().arity().length > 0 ? [ this.Arity() ] : [] ),
				this.Refinements(),
				... ( this.Search().results().length === 0 ? [ this.Search_nothing_found() ] : [] ),
				this.Search_results(),
			]
		}

		search_results() {
			if( !this.Search().params_labels().length ) return []
			return this.Search().results().map( obj => this.Item( obj ) )
		}

		// Массив конфигураций для рендеринга полей
		private itemRendererConfigs: ItemRendererConfig[] = [
			{ valueGetter: o => o.thumbs_link(), component: o => this.Thumbs(o), emptyValue: '' },
			{ valueGetter: o => o.id(), component: o => this.Id(o) },
			{ valueGetter: o => o.bib_id(), component: o => this.Bib(o), emptyValue: '0' },
			{ valueGetter: o => o.formula_html(), component: o => this.Formula(o) },
			{ valueGetter: o => o.property(), component: o => this.Property(o) },
			{ valueGetter: o => o.ref_link(), component: o => this.Ref(o), emptyValue: '' },
			{ valueGetter: o => o.pdf_link(), component: o => this.Pdf(o), emptyValue: '' },
			{ valueGetter: o => o.png_link(), component: o => this.Png(o), emptyValue: '' },
			{ valueGetter: o => o.gif_link(), component: o => this.Gif(o), emptyValue: '' },
		];

		// Универсальный метод для рендеринга одного элемента
		private renderItem(obj: $optimade_zero_entry, config: ItemRendererConfig) {
			const value = config.valueGetter(obj);
			// Если значение пустое (или равно заданному emptyValue), возвращаем null
			if (!value || value === config.emptyValue) return null;
			return config.component(obj);
		}
		// Метод для формирования строки записи на основе конфигураций
		item_row(obj: $optimade_zero_entry) {
			return this.itemRendererConfigs.map(cfg => this.renderItem(obj, cfg));
		}

		// Остальные методы оставляем для совместимости,
		// хотя большинство делегируют работу методам из $optimade_zero_entry
		item_id( obj: $optimade_zero_entry ) {
			return obj.id()
		}

		item_thumbs( obj: $optimade_zero_entry ) {
			return obj.thumbs_link()
		}


		item_html( obj: $optimade_zero_entry ) {
			// Используем sanitizeHTML, разрешая теги sub и sup
			const safe_html = sanitizeHTML(obj.formula_html(), ['sub', 'sup']);
			return `<div>${ safe_html }</div>`
		}

		item_property( obj: $optimade_zero_entry ) {
			return obj.property()
		}

		item_bib( obj: $optimade_zero_entry ) {
			return `${ obj.bib_id() }'${ obj.year().toString().slice( -2 ) }`
		}

		item_ref( obj: $optimade_zero_entry ) {
			return obj.ref_link()
		}

		item_pdf( obj: $optimade_zero_entry ) {
			return obj.pdf_link()
		}

		item_png( obj: $optimade_zero_entry ) {
			return obj.png_link()
		}

		item_gif( obj: $optimade_zero_entry ) {
			return obj.gif_link()
		}

		arity_dict(): Record<string, string> {
			return this.Search().arity().reduce((dict: Record<string, string>, name: string): Record<string, string> => {
				dict[name] = name;
				return dict;
			}, {} as Record<string, string>);
		}

		@$mol_mem
		refinements() {
			// Порядок вывода для определённых facet'ов
			const order: ( keyof $optimade_zero_search_params )[] = [
				'elements',
				'formulae',
				'props',
				'classes',
				'lattices',
			]
			const refData = this.Search().refinements()

			return order
				.map( facet => refData[ facet ]?.length ? this.Refinement( facet ) : null )
				.filter( Boolean )
		}

		refinement_title( facet: keyof $optimade_zero_search_params ) {
			return this.Search().param_names()[ facet ]
		}

		refinement_content( facet: keyof $optimade_zero_search_params ) {
			return this.Search().refinements()[ facet ]!.map(
				(obj: typeof $optimade_zero_search_refinement_item.Value) => this.Refinement_link( obj )
			)
		}

		refinement_link_title( obj: typeof $optimade_zero_search_refinement_item.Value ) {
			return `${ obj.value }`
		}

		@ $mol_mem_key
		refinement_link_arg( obj: typeof $optimade_zero_search_refinement_item.Value ) {
			// Создаём новый объект поиска, основанный на текущих параметрах,
			// удаляем facet и добавляем новое значение для него
			const newSearch = new this.$.$optimade_zero_search()
			newSearch.params( this.search_params() )
			newSearch.param_drop( obj.facet )
			newSearch.param_add( obj.facet, obj.value )
			return newSearch.params()
		}

		@$mol_mem
		arity( next?: string ) {
			if ( next !== undefined ) {
				const reset = Object.values( this.Search().arity_names() )
				reset.forEach( val => this.Search().param_drop( 'classes', val ) )
				this.Search().param_add( 'classes', next )
			}
			return next ?? ''
		}
	}
}
