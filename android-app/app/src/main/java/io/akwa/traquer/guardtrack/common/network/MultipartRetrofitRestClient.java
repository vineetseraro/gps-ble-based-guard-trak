package io.akwa.traquer.guardtrack.common.network;

import android.support.annotation.NonNull;


import java.io.IOException;
import java.util.concurrent.TimeUnit;

import io.akwa.traquer.guardtrack.BaseApplication;
import io.akwa.traquer.guardtrack.BuildConfig;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MultipartRetrofitRestClient {
    private static ApiService apiService;


    public static ApiService getInstance() {

        if (apiService == null) {
            HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
            logging.setLevel(HttpLoggingInterceptor.Level.BODY);
            OkHttpClient client = getOkHttpClient(logging);
            Retrofit retrofit = getRetrofit(client);
            apiService = retrofit.create(ApiService.class);
        }
        return apiService;
    }

    @NonNull
    private static Retrofit getRetrofit(OkHttpClient client) {
        return new Retrofit.Builder()
                .baseUrl(BuildConfig.IS_PROD?BuildConfig.PROD_BASE_URL:BuildConfig.QC_BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
    }

    @NonNull
    private static OkHttpClient getOkHttpClient(HttpLoggingInterceptor logging) {
        return new OkHttpClient.Builder()
                .addInterceptor(new Interceptor() {
                    @Override
                    public Response intercept(Chain chain) throws IOException {
                        Request original = chain.request();
                        Request request = getDefaultRequest(original);
                        return chain.proceed(request);
                    }
                })
                .readTimeout(60, TimeUnit.SECONDS)
                .connectTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(60,TimeUnit.SECONDS)
                .addInterceptor(logging)
                .build();
    }

    private static Request getDefaultRequest(Request original) {
        return original.newBuilder().
                addHeader("Accept", "application/json").
                addHeader("deviceId", BaseApplication.deviceId).
                addHeader("AppType", BaseApplication.appType).build();
    }
}
