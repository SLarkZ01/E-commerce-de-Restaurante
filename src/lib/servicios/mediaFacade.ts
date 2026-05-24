import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface ResultadoSubida {
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

export class MediaFacade {
  static async subirImagen(
    fileBuffer: Buffer,
    options?: {
      folder?: string;
      publicId?: string;
      transformation?: Record<string, unknown>;
    }
  ): Promise<ResultadoSubida> {
    return new Promise((resolve, reject) => {
      const uploadOptions: Record<string, unknown> = {
        folder: options?.folder ?? "e-kitchen/platos",
        resource_type: "image",
        overwrite: true,
      };

      if (options?.publicId) {
        uploadOptions.public_id = options.publicId;
      }

      if (options?.transformation) {
        uploadOptions.transformation = options.transformation;
      }

      const stream = cloudinary.v2.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Sin resultado de Cloudinary"));

          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          });
        }
      );

      stream.end(fileBuffer);
    });
  }

  static async subirImagenDesdeUrl(
    url: string,
    options?: {
      folder?: string;
      publicId?: string;
      transformation?: Record<string, unknown>;
    }
  ): Promise<ResultadoSubida> {
    const uploadOptions: Record<string, unknown> = {
      folder: options?.folder ?? "e-kitchen/platos",
      resource_type: "image",
      overwrite: true,
    };

    if (options?.publicId) {
      uploadOptions.public_id = options.publicId;
    }

    if (options?.transformation) {
      uploadOptions.transformation = options.transformation;
    }

    const result = await cloudinary.v2.uploader.upload(url, uploadOptions);

    return {
      secureUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  }

  static async eliminarImagen(publicId: string): Promise<boolean> {
    const { result } = await cloudinary.v2.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });

    if (result !== "ok") {
      console.error(
        `[MediaFacade.eliminarImagen] destroy retornó "${result}" para publicId=${publicId}`
      );
      return false;
    }

    return true;
  }

  static extraerPublicId(url: string): string | null {
    try {
      const regex = /\/upload\/(?:[^/]+\/)*v\d+\/(.+?)(?:\.\w+)?$/;
      const match = url.match(regex);
      return match?.[1] ?? null;
    } catch {
      return null;
    }
  }

  static firmarParametros(params: Record<string, string>): string {
    const signature = cloudinary.v2.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET!
    );

    return signature;
  }
}
