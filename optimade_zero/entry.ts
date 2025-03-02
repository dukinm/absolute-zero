namespace $.$$  {

	// Определяем маппинг полей записи
	enum EntryField {
		ID = 0,
		FORMULA = 1,
		PROPERTY = 2,
		DATA_TYPE_INDEX = 3,
		IS_PUBLIC = 4,
		BIB_ID = 5,
		YEAR = 6,
		REF_ID = 7,
	}

	export class $optimade_zero_entry extends $mol_store<typeof $optimade_zero_search_entry.Value> {

		api_uri() {
			return 'https://api.mpds.io/v0';
		}

		// Геттеры с использованием enum
		id(): string {
			return this.value( EntryField.ID );
		}

		id_prefix(): string {
			return this.id().split( '-' )[ 0 ];
		}

		type(): string {
			return this.id()[ 0 ];
		}

		formula_html(): string {
			return this.value( EntryField.FORMULA );
		}

		property(): string {
			return this.value( EntryField.PROPERTY );
		}

		data_type(): string {
			const dt = this.value( EntryField.DATA_TYPE_INDEX );
			if( dt === 7 ) return 'ml_data';
			if( [ 8, 9, 10, 11 ].includes( dt ) ) return 'ab_data';
			return '';
		}

		is_public(): boolean {
			return this.value( EntryField.IS_PUBLIC );
		}

		bib_id(): string {
			return this.ref_id() === 999999 ? '0' : this.value( EntryField.BIB_ID );
		}

		year(): number {
			return this.value( EntryField.YEAR );
		}

		ref_id(): number {
			return this.value( EntryField.REF_ID );
		}

		// Универсальная функция для формирования ссылок на скачивание
		private downloadLink( format: 'bib' | 'pdf' | 'png' | 'gif' ): string {
			const t = this.type();
			const api = this.api_uri();
			const prefix = this.id_prefix();
			const refId = this.ref_id();
			switch( format ) {
				case 'bib':
					return t === 'P' ? `${ api }/download/bib?ref_id=${ refId }&sid=&fmt=bib` : '';
				case 'pdf':
					return t === 'P' ? `${ api }/download/${ t.toLowerCase() }?q=${ prefix }&sid=&fmt=pdf` : '';
				case 'png':
					return t !== 'P' ? `${ api }/download/${ t.toLowerCase() }?q=${ prefix }&sid=&fmt=png` : '';
				case 'gif':
					return t === 'S' ? `${ api }/download/${ t.toLowerCase() }?q=${ prefix }&fmt=gif` : '';
				default:
					return '';
			}
		}

		// Методы, использующие универсальную функцию
		ref_link(): string {
			return this.downloadLink( 'bib' );
		}

		pdf_link(): string {
			return this.downloadLink( 'pdf' );
		}

		png_link(): string {
			return this.downloadLink( 'png' );
		}

		gif_link(): string {
			return this.downloadLink( 'gif' );
		}

		// Отдельная функция для формирования ссылки миниатюры
		thumbs_link(): string {
			return this.downloadLink( 'png' );
		}
	}
}
