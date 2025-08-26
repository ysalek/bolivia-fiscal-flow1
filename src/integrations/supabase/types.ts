export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activos_fijos: {
        Row: {
          categoria: string | null
          codigo: string
          costo_inicial: number
          created_at: string
          descripcion: string | null
          estado: string | null
          fecha_adquisicion: string
          id: string
          metodo_depreciacion: string | null
          nombre: string
          ubicacion: string | null
          updated_at: string
          user_id: string
          valor_residual: number | null
          vida_util_anos: number
        }
        Insert: {
          categoria?: string | null
          codigo: string
          costo_inicial?: number
          created_at?: string
          descripcion?: string | null
          estado?: string | null
          fecha_adquisicion: string
          id?: string
          metodo_depreciacion?: string | null
          nombre: string
          ubicacion?: string | null
          updated_at?: string
          user_id: string
          valor_residual?: number | null
          vida_util_anos: number
        }
        Update: {
          categoria?: string | null
          codigo?: string
          costo_inicial?: number
          created_at?: string
          descripcion?: string | null
          estado?: string | null
          fecha_adquisicion?: string
          id?: string
          metodo_depreciacion?: string | null
          nombre?: string
          ubicacion?: string | null
          updated_at?: string
          user_id?: string
          valor_residual?: number | null
          vida_util_anos?: number
        }
        Relationships: []
      }
      anticipos: {
        Row: {
          cliente_id: string | null
          created_at: string
          empleado_id: string | null
          estado: string | null
          fecha: string
          id: string
          monto: number
          monto_descontado: number | null
          motivo: string
          proveedor_id: string | null
          saldo_pendiente: number
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          empleado_id?: string | null
          estado?: string | null
          fecha: string
          id?: string
          monto: number
          monto_descontado?: number | null
          motivo: string
          proveedor_id?: string | null
          saldo_pendiente: number
          tipo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          empleado_id?: string | null
          estado?: string | null
          fecha?: string
          id?: string
          monto?: number
          monto_descontado?: number | null
          motivo?: string
          proveedor_id?: string | null
          saldo_pendiente?: number
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "anticipos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anticipos_empleado_id_fkey"
            columns: ["empleado_id"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anticipos_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          created_at: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      asientos_contables: {
        Row: {
          concepto: string
          created_at: string | null
          debe: number | null
          estado: string | null
          fecha: string
          haber: number | null
          id: string
          numero: string
          referencia: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          concepto: string
          created_at?: string | null
          debe?: number | null
          estado?: string | null
          fecha: string
          haber?: number | null
          id?: string
          numero: string
          referencia?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          concepto?: string
          created_at?: string | null
          debe?: number | null
          estado?: string | null
          fecha?: string
          haber?: number | null
          id?: string
          numero?: string
          referencia?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      categorias_productos: {
        Row: {
          activo: boolean | null
          created_at: string | null
          descripcion: string | null
          id: string
          nombre: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      centros_costo: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          tipo: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          tipo?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          tipo?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          activo: boolean | null
          created_at: string | null
          direccion: string | null
          email: string | null
          id: string
          nit: string
          nombre: string
          telefono: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          nit: string
          nombre: string
          telefono?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          nit?: string
          nombre?: string
          telefono?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      compras: {
        Row: {
          created_at: string | null
          descuento_total: number | null
          estado: string | null
          fecha: string
          fecha_vencimiento: string | null
          id: string
          iva: number | null
          numero: string
          observaciones: string | null
          proveedor_id: string | null
          subtotal: number | null
          total: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          descuento_total?: number | null
          estado?: string | null
          fecha: string
          fecha_vencimiento?: string | null
          id?: string
          iva?: number | null
          numero: string
          observaciones?: string | null
          proveedor_id?: string | null
          subtotal?: number | null
          total?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          descuento_total?: number | null
          estado?: string | null
          fecha?: string
          fecha_vencimiento?: string | null
          id?: string
          iva?: number | null
          numero?: string
          observaciones?: string | null
          proveedor_id?: string | null
          subtotal?: number | null
          total?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compras_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
        ]
      }
      comprobantes_integrados: {
        Row: {
          codigo_control: string | null
          created_at: string
          cuf: string | null
          cufd: string | null
          estado: string | null
          estado_sin: string | null
          fecha: string
          id: string
          iva: number
          nit: string
          numero_comprobante: string
          razon_social: string
          subtotal: number
          tipo_comprobante: string
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          codigo_control?: string | null
          created_at?: string
          cuf?: string | null
          cufd?: string | null
          estado?: string | null
          estado_sin?: string | null
          fecha: string
          id?: string
          iva?: number
          nit: string
          numero_comprobante: string
          razon_social: string
          subtotal?: number
          tipo_comprobante: string
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          codigo_control?: string | null
          created_at?: string
          cuf?: string | null
          cufd?: string | null
          estado?: string | null
          estado_sin?: string | null
          fecha?: string
          id?: string
          iva?: number
          nit?: string
          numero_comprobante?: string
          razon_social?: string
          subtotal?: number
          tipo_comprobante?: string
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      configuracion_tributaria: {
        Row: {
          actividad_economica: string
          codigo_actividad: string
          created_at: string
          id: string
          it_tasa: number
          iue_tasa: number
          iva_tasa: number
          nit_empresa: string
          razon_social: string
          rc_it_tasa: number
          rc_iva_tasa: number
          regimen_tributario: string
          tipo_cambio_usd: number
          ufv_actual: number
          updated_at: string
        }
        Insert: {
          actividad_economica: string
          codigo_actividad: string
          created_at?: string
          id?: string
          it_tasa?: number
          iue_tasa?: number
          iva_tasa?: number
          nit_empresa: string
          razon_social: string
          rc_it_tasa?: number
          rc_iva_tasa?: number
          regimen_tributario?: string
          tipo_cambio_usd?: number
          ufv_actual?: number
          updated_at?: string
        }
        Update: {
          actividad_economica?: string
          codigo_actividad?: string
          created_at?: string
          id?: string
          it_tasa?: number
          iue_tasa?: number
          iva_tasa?: number
          nit_empresa?: string
          razon_social?: string
          rc_it_tasa?: number
          rc_iva_tasa?: number
          regimen_tributario?: string
          tipo_cambio_usd?: number
          ufv_actual?: number
          updated_at?: string
        }
        Relationships: []
      }
      cuentas_asientos: {
        Row: {
          asiento_id: string | null
          codigo_cuenta: string
          created_at: string | null
          debe: number | null
          haber: number | null
          id: string
          nombre_cuenta: string
        }
        Insert: {
          asiento_id?: string | null
          codigo_cuenta: string
          created_at?: string | null
          debe?: number | null
          haber?: number | null
          id?: string
          nombre_cuenta: string
        }
        Update: {
          asiento_id?: string | null
          codigo_cuenta?: string
          created_at?: string | null
          debe?: number | null
          haber?: number | null
          id?: string
          nombre_cuenta?: string
        }
        Relationships: [
          {
            foreignKeyName: "cuentas_asientos_asiento_id_fkey"
            columns: ["asiento_id"]
            isOneToOne: false
            referencedRelation: "asientos_contables"
            referencedColumns: ["id"]
          },
        ]
      }
      cuentas_bancarias: {
        Row: {
          activa: boolean | null
          banco: string
          created_at: string
          id: string
          moneda: string | null
          nombre: string
          numero_cuenta: string
          saldo: number | null
          tipo_cuenta: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activa?: boolean | null
          banco: string
          created_at?: string
          id?: string
          moneda?: string | null
          nombre: string
          numero_cuenta: string
          saldo?: number | null
          tipo_cuenta?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activa?: boolean | null
          banco?: string
          created_at?: string
          id?: string
          moneda?: string | null
          nombre?: string
          numero_cuenta?: string
          saldo?: number | null
          tipo_cuenta?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      declaraciones_tributarias: {
        Row: {
          created_at: string
          estado: string | null
          fecha_presentacion: string | null
          fecha_vencimiento: string
          gestion: number
          id: string
          mes: number | null
          monto_base: number | null
          monto_impuesto: number | null
          monto_pagado: number | null
          observaciones: string | null
          periodo: string
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          estado?: string | null
          fecha_presentacion?: string | null
          fecha_vencimiento: string
          gestion: number
          id?: string
          mes?: number | null
          monto_base?: number | null
          monto_impuesto?: number | null
          monto_pagado?: number | null
          observaciones?: string | null
          periodo: string
          tipo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          estado?: string | null
          fecha_presentacion?: string | null
          fecha_vencimiento?: string
          gestion?: number
          id?: string
          mes?: number | null
          monto_base?: number | null
          monto_impuesto?: number | null
          monto_pagado?: number | null
          observaciones?: string | null
          periodo?: string
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      depreciaciones_activos: {
        Row: {
          activo_id: string
          created_at: string
          depreciacion_acumulada: number
          fecha_depreciacion: string
          id: string
          periodo: string
          user_id: string
          valor_depreciacion: number
          valor_neto: number
        }
        Insert: {
          activo_id: string
          created_at?: string
          depreciacion_acumulada?: number
          fecha_depreciacion: string
          id?: string
          periodo: string
          user_id: string
          valor_depreciacion: number
          valor_neto: number
        }
        Update: {
          activo_id?: string
          created_at?: string
          depreciacion_acumulada?: number
          fecha_depreciacion?: string
          id?: string
          periodo?: string
          user_id?: string
          valor_depreciacion?: number
          valor_neto?: number
        }
        Relationships: [
          {
            foreignKeyName: "depreciaciones_activos_activo_id_fkey"
            columns: ["activo_id"]
            isOneToOne: false
            referencedRelation: "activos_fijos"
            referencedColumns: ["id"]
          },
        ]
      }
      empleados: {
        Row: {
          apellidos: string
          beneficios: string[] | null
          cargo: string
          ci: string
          created_at: string | null
          departamento: string
          direccion: string | null
          email: string | null
          estado: string | null
          estado_civil: string | null
          fecha_ingreso: string
          fecha_nacimiento: string
          genero: string | null
          id: string
          nombres: string
          numero_empleado: string
          salario_base: number
          telefono: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          apellidos: string
          beneficios?: string[] | null
          cargo: string
          ci: string
          created_at?: string | null
          departamento: string
          direccion?: string | null
          email?: string | null
          estado?: string | null
          estado_civil?: string | null
          fecha_ingreso: string
          fecha_nacimiento: string
          genero?: string | null
          id?: string
          nombres: string
          numero_empleado: string
          salario_base?: number
          telefono?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          apellidos?: string
          beneficios?: string[] | null
          cargo?: string
          ci?: string
          created_at?: string | null
          departamento?: string
          direccion?: string | null
          email?: string | null
          estado?: string | null
          estado_civil?: string | null
          fecha_ingreso?: string
          fecha_nacimiento?: string
          genero?: string | null
          id?: string
          nombres?: string
          numero_empleado?: string
          salario_base?: number
          telefono?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      facturas: {
        Row: {
          cliente_id: string | null
          codigo_control: string | null
          created_at: string | null
          cuf: string | null
          cufd: string | null
          descuento_total: number | null
          estado: string | null
          estado_sin: string | null
          fecha: string
          fecha_vencimiento: string | null
          id: string
          iva: number | null
          numero: string
          observaciones: string | null
          punto_venta: number | null
          subtotal: number | null
          total: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          codigo_control?: string | null
          created_at?: string | null
          cuf?: string | null
          cufd?: string | null
          descuento_total?: number | null
          estado?: string | null
          estado_sin?: string | null
          fecha: string
          fecha_vencimiento?: string | null
          id?: string
          iva?: number | null
          numero: string
          observaciones?: string | null
          punto_venta?: number | null
          subtotal?: number | null
          total?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          codigo_control?: string | null
          created_at?: string | null
          cuf?: string | null
          cufd?: string | null
          descuento_total?: number | null
          estado?: string | null
          estado_sin?: string | null
          fecha?: string
          fecha_vencimiento?: string | null
          id?: string
          iva?: number | null
          numero?: string
          observaciones?: string | null
          punto_venta?: number | null
          subtotal?: number | null
          total?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facturas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      items_compras: {
        Row: {
          cantidad: number
          compra_id: string | null
          costo_unitario: number
          created_at: string | null
          descripcion: string
          id: string
          producto_id: string | null
          subtotal: number
        }
        Insert: {
          cantidad: number
          compra_id?: string | null
          costo_unitario: number
          created_at?: string | null
          descripcion: string
          id?: string
          producto_id?: string | null
          subtotal: number
        }
        Update: {
          cantidad?: number
          compra_id?: string | null
          costo_unitario?: number
          created_at?: string | null
          descripcion?: string
          id?: string
          producto_id?: string | null
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "items_compras_compra_id_fkey"
            columns: ["compra_id"]
            isOneToOne: false
            referencedRelation: "compras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_compras_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      items_comprobantes_integrados: {
        Row: {
          cantidad: number
          codigo: string
          comprobante_id: string
          created_at: string
          descripcion: string
          descuento: number | null
          id: string
          precio_unitario: number
          producto_id: string | null
          subtotal: number
        }
        Insert: {
          cantidad: number
          codigo: string
          comprobante_id: string
          created_at?: string
          descripcion: string
          descuento?: number | null
          id?: string
          precio_unitario: number
          producto_id?: string | null
          subtotal: number
        }
        Update: {
          cantidad?: number
          codigo?: string
          comprobante_id?: string
          created_at?: string
          descripcion?: string
          descuento?: number | null
          id?: string
          precio_unitario?: number
          producto_id?: string | null
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "items_comprobantes_integrados_comprobante_id_fkey"
            columns: ["comprobante_id"]
            isOneToOne: false
            referencedRelation: "comprobantes_integrados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_comprobantes_integrados_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      items_facturas: {
        Row: {
          cantidad: number
          codigo: string
          codigo_sin: string | null
          created_at: string | null
          descripcion: string
          descuento: number | null
          factura_id: string | null
          id: string
          precio_unitario: number
          producto_id: string | null
          subtotal: number
        }
        Insert: {
          cantidad: number
          codigo: string
          codigo_sin?: string | null
          created_at?: string | null
          descripcion: string
          descuento?: number | null
          factura_id?: string | null
          id?: string
          precio_unitario: number
          producto_id?: string | null
          subtotal: number
        }
        Update: {
          cantidad?: number
          codigo?: string
          codigo_sin?: string | null
          created_at?: string | null
          descripcion?: string
          descuento?: number | null
          factura_id?: string | null
          id?: string
          precio_unitario?: number
          producto_id?: string | null
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "items_facturas_factura_id_fkey"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "facturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_facturas_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      items_presupuestos: {
        Row: {
          categoria: string
          concepto: string
          created_at: string | null
          ejecutado: number | null
          id: string
          porcentaje_ejecucion: number | null
          presupuestado: number
          presupuesto_id: string | null
          updated_at: string | null
          variacion: number | null
        }
        Insert: {
          categoria: string
          concepto: string
          created_at?: string | null
          ejecutado?: number | null
          id?: string
          porcentaje_ejecucion?: number | null
          presupuestado?: number
          presupuesto_id?: string | null
          updated_at?: string | null
          variacion?: number | null
        }
        Update: {
          categoria?: string
          concepto?: string
          created_at?: string | null
          ejecutado?: number | null
          id?: string
          porcentaje_ejecucion?: number | null
          presupuestado?: number
          presupuesto_id?: string | null
          updated_at?: string | null
          variacion?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "items_presupuestos_presupuesto_id_fkey"
            columns: ["presupuesto_id"]
            isOneToOne: false
            referencedRelation: "presupuestos"
            referencedColumns: ["id"]
          },
        ]
      }
      movimientos_bancarios: {
        Row: {
          beneficiario: string | null
          created_at: string
          cuenta_bancaria_id: string
          descripcion: string
          fecha: string
          id: string
          monto: number
          numero_comprobante: string | null
          saldo_actual: number | null
          saldo_anterior: number | null
          tipo: string
          user_id: string
        }
        Insert: {
          beneficiario?: string | null
          created_at?: string
          cuenta_bancaria_id: string
          descripcion: string
          fecha: string
          id?: string
          monto: number
          numero_comprobante?: string | null
          saldo_actual?: number | null
          saldo_anterior?: number | null
          tipo: string
          user_id: string
        }
        Update: {
          beneficiario?: string | null
          created_at?: string
          cuenta_bancaria_id?: string
          descripcion?: string
          fecha?: string
          id?: string
          monto?: number
          numero_comprobante?: string | null
          saldo_actual?: number | null
          saldo_anterior?: number | null
          tipo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "movimientos_bancarios_cuenta_bancaria_id_fkey"
            columns: ["cuenta_bancaria_id"]
            isOneToOne: false
            referencedRelation: "cuentas_bancarias"
            referencedColumns: ["id"]
          },
        ]
      }
      movimientos_inventario: {
        Row: {
          cantidad: number
          compra_id: string | null
          costo_unitario: number | null
          created_at: string | null
          factura_id: string | null
          fecha: string
          id: string
          observaciones: string | null
          producto_id: string | null
          stock_actual: number | null
          stock_anterior: number | null
          tipo: string
          user_id: string | null
        }
        Insert: {
          cantidad: number
          compra_id?: string | null
          costo_unitario?: number | null
          created_at?: string | null
          factura_id?: string | null
          fecha: string
          id?: string
          observaciones?: string | null
          producto_id?: string | null
          stock_actual?: number | null
          stock_anterior?: number | null
          tipo: string
          user_id?: string | null
        }
        Update: {
          cantidad?: number
          compra_id?: string | null
          costo_unitario?: number | null
          created_at?: string | null
          factura_id?: string | null
          fecha?: string
          id?: string
          observaciones?: string | null
          producto_id?: string | null
          stock_actual?: number | null
          stock_anterior?: number | null
          tipo?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movimientos_inventario_compra_id_fkey"
            columns: ["compra_id"]
            isOneToOne: false
            referencedRelation: "compras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimientos_inventario_factura_id_fkey"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "facturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimientos_inventario_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos: {
        Row: {
          compra_id: string | null
          created_at: string
          estado: string | null
          factura_id: string | null
          fecha: string
          id: string
          metodo_pago: string | null
          monto: number
          numero_comprobante: string | null
          observaciones: string | null
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          compra_id?: string | null
          created_at?: string
          estado?: string | null
          factura_id?: string | null
          fecha: string
          id?: string
          metodo_pago?: string | null
          monto: number
          numero_comprobante?: string | null
          observaciones?: string | null
          tipo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          compra_id?: string | null
          created_at?: string
          estado?: string | null
          factura_id?: string | null
          fecha?: string
          id?: string
          metodo_pago?: string | null
          monto?: number
          numero_comprobante?: string | null
          observaciones?: string | null
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pagos_compra_id_fkey"
            columns: ["compra_id"]
            isOneToOne: false
            referencedRelation: "compras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_factura_id_fkey"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "facturas"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_cuentas: {
        Row: {
          activa: boolean | null
          codigo: string
          created_at: string
          cuenta_padre: string | null
          id: string
          naturaleza: string
          nivel: number | null
          nombre: string
          saldo: number | null
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activa?: boolean | null
          codigo: string
          created_at?: string
          cuenta_padre?: string | null
          id?: string
          naturaleza: string
          nivel?: number | null
          nombre: string
          saldo?: number | null
          tipo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activa?: boolean | null
          codigo?: string
          created_at?: string
          cuenta_padre?: string | null
          id?: string
          naturaleza?: string
          nivel?: number | null
          nombre?: string
          saldo?: number | null
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plan_cuentas_2025: {
        Row: {
          activa: boolean
          codigo: string
          created_at: string
          cuenta_padre: string | null
          descripcion: string | null
          id: string
          nivel: number
          nombre: string
          tipo: string
          updated_at: string
        }
        Insert: {
          activa?: boolean
          codigo: string
          created_at?: string
          cuenta_padre?: string | null
          descripcion?: string | null
          id?: string
          nivel: number
          nombre: string
          tipo: string
          updated_at?: string
        }
        Update: {
          activa?: boolean
          codigo?: string
          created_at?: string
          cuenta_padre?: string | null
          descripcion?: string | null
          id?: string
          nivel?: number
          nombre?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_cuentas_2025_cuenta_padre_fkey"
            columns: ["cuenta_padre"]
            isOneToOne: false
            referencedRelation: "plan_cuentas_2025"
            referencedColumns: ["codigo"]
          },
        ]
      }
      presupuestos: {
        Row: {
          created_at: string | null
          descripcion: string | null
          estado: string | null
          fecha_fin: string
          fecha_inicio: string
          id: string
          nombre: string
          periodo: string
          responsable: string | null
          total_ejecutado: number | null
          total_presupuestado: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          estado?: string | null
          fecha_fin: string
          fecha_inicio: string
          id?: string
          nombre: string
          periodo: string
          responsable?: string | null
          total_ejecutado?: number | null
          total_presupuestado?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          estado?: string | null
          fecha_fin?: string
          fecha_inicio?: string
          id?: string
          nombre?: string
          periodo?: string
          responsable?: string | null
          total_ejecutado?: number | null
          total_presupuestado?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      productos: {
        Row: {
          activo: boolean | null
          categoria_id: string | null
          codigo: string
          codigo_sin: string | null
          costo_unitario: number
          created_at: string | null
          descripcion: string | null
          id: string
          imagen_url: string | null
          nombre: string
          precio_compra: number
          precio_venta: number
          stock_actual: number | null
          stock_minimo: number | null
          unidad_medida: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          activo?: boolean | null
          categoria_id?: string | null
          codigo: string
          codigo_sin?: string | null
          costo_unitario?: number
          created_at?: string | null
          descripcion?: string | null
          id?: string
          imagen_url?: string | null
          nombre: string
          precio_compra?: number
          precio_venta?: number
          stock_actual?: number | null
          stock_minimo?: number | null
          unidad_medida?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          activo?: boolean | null
          categoria_id?: string | null
          codigo?: string
          codigo_sin?: string | null
          costo_unitario?: number
          created_at?: string | null
          descripcion?: string | null
          id?: string
          imagen_url?: string | null
          nombre?: string
          precio_compra?: number
          precio_venta?: number
          stock_actual?: number | null
          stock_minimo?: number | null
          unidad_medida?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_productos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          empresa: string | null
          id: string
          permisos: string[]
          telefono: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          empresa?: string | null
          id: string
          permisos?: string[]
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          empresa?: string | null
          id?: string
          permisos?: string[]
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      proveedores: {
        Row: {
          activo: boolean | null
          created_at: string | null
          direccion: string | null
          email: string | null
          id: string
          nit: string
          nombre: string
          telefono: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          nit: string
          nombre: string
          telefono?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          nit?: string
          nombre?: string
          telefono?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      ventas_credito: {
        Row: {
          cliente_id: string
          created_at: string
          estado: string | null
          factura_id: string
          fecha_vencimiento: string
          fecha_venta: string
          id: string
          interes_mora: number | null
          monto_pagado: number | null
          monto_total: number
          plazo_dias: number
          saldo_pendiente: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          estado?: string | null
          factura_id: string
          fecha_vencimiento: string
          fecha_venta: string
          id?: string
          interes_mora?: number | null
          monto_pagado?: number | null
          monto_total: number
          plazo_dias: number
          saldo_pendiente: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          estado?: string | null
          factura_id?: string
          fecha_vencimiento?: string
          fecha_venta?: string
          id?: string
          interes_mora?: number | null
          monto_pagado?: number | null
          monto_total?: number
          plazo_dias?: number
          saldo_pendiente?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ventas_credito_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ventas_credito_factura_id_fkey"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "facturas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
