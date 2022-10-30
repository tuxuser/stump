use axum::{
	routing::{get, post},
	Extension, Json, Router,
};
use stump_core::prelude::{ClaimResponse, StumpVersion};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use crate::{config::state::State, errors::ApiResult};

mod auth;
mod epub;
mod filesystem;
mod job;
mod library;
mod log;
mod media;
mod reading_list;
mod series;
mod tag;
mod user;

pub(crate) fn mount() -> Router {
	Router::new().nest(
		"/api",
		Router::new()
			.merge(
				SwaggerUi::new("/swagger-ui/*tail")
					.url("/api/openapi.json", ApiDoc::openapi()),
			)
			.merge(auth::mount())
			.merge(epub::mount())
			.merge(library::mount())
			.merge(media::mount())
			.merge(filesystem::mount())
			.merge(job::mount())
			.merge(log::mount())
			.merge(series::mount())
			.merge(tag::mount())
			.merge(user::mount())
			.merge(reading_list::mount())
			.route("/claim", get(claim))
			.route("/ping", get(ping))
			// TODO: why did I choose post?
			.route("/version", post(version)),
	)
}

#[derive(OpenApi)]
#[openapi(
        paths(
            claim,
			ping,
			version
        ),
        components(
            schemas(
				ClaimResponse,
				StumpVersion
			)
        ),
        tags(
            (name = "auth", description = "Authentication API"),
        )
    )]
struct ApiDoc;

#[utoipa::path(
	get,
	path = "/api/claim",
	responses(
		(status = 200, description = "Claim status successfully determined", body = ClaimResponse)
	)
)]
async fn claim(Extension(ctx): State) -> ApiResult<Json<ClaimResponse>> {
	let db = ctx.get_db();

	Ok(Json(ClaimResponse {
		is_claimed: db.user().find_first(vec![]).exec().await?.is_some(),
	}))
}

#[utoipa::path(
	get,
	path = "/api/ping",
	responses(
		(status = 200, description = "Always responds with 'pong'", body = String)
	)
)]
async fn ping() -> ApiResult<String> {
	Ok("pong".to_string())
}

#[utoipa::path(
	post,
	path = "/api/version",
	responses(
		(status = 200, description = "Version information for the Stump server instance", body = StumpVersion)
	)
)]
async fn version() -> ApiResult<Json<StumpVersion>> {
	Ok(Json(StumpVersion {
		semver: env!("CARGO_PKG_VERSION").to_string(),
		rev: std::env::var("GIT_REV").ok(),
		compile_time: env!("STATIC_BUILD_DATE").to_string(),
	}))
}
