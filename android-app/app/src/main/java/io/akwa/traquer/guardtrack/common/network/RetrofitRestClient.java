package io.akwa.traquer.guardtrack.common.network;

import android.support.annotation.NonNull;



import java.io.IOException;

import io.akwa.traquer.guardtrack.BaseApplication;
import io.akwa.traquer.guardtrack.BuildConfig;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;


public class  RetrofitRestClient {

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
                .addInterceptor(logging)
                .build();
    }

    private static Request getDefaultRequest(Request original) {

        String authorization= PrefUtils.getAccessToken();
        return original.newBuilder().
                addHeader("Accept", "application/json").
                addHeader("Content-Type", "application/json").
                addHeader("deviceid", BaseApplication.deviceId).
                addHeader("Authorization", authorization).
                addHeader("role", "warehouse").
                addHeader("appname", BaseApplication.appName).

                addHeader("apptype", BaseApplication.appType).build();
    }
}