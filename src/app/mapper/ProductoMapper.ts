import { ProductoFinanciero } from "../Modelos/ProductoFinanciero"
import { ProductoFinancieroDTO } from "../DTO/ProductoFinancieroDTO";

export class ProductoMapper {
    static transformarAdto(producto: ProductoFinanciero): ProductoFinancieroDTO {
        return {
            id: producto.id,
            name: producto.name,
            description: producto.description,
            logo: producto.logo,
            date_release: producto.fechaEntrega.toISOString(),
            date_revision: producto.fechaEntrega.toISOString()
        };
    }

    static transformarAProducto(dto: ProductoFinancieroDTO): ProductoFinanciero {
        return new ProductoFinanciero(
            dto.id,
            dto.name,
            dto.description,
            dto.logo,
            new Date(dto.date_release),
            new Date(dto.date_revision)
        );
    }

}
