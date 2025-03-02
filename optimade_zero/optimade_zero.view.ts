namespace $.$$ {

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
			const safe_html=obj.formula_html().replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;');
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
